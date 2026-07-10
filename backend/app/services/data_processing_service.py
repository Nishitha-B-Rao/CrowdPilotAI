import io
from typing import Dict, Any
import pandas as pd
from fastapi import UploadFile, HTTPException

from app.models.telemetry import StadiumState, Gate
from app.api.deps import get_telemetry_service

class DataProcessingService:
    @staticmethod
    async def process_crowd_csv(file: UploadFile) -> StadiumState:
        """
        Parses a CSV file containing crowd density and gate occupancy data.
        Updates the global telemetry state and returns it.
        """
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
            
        content = await file.read()
        try:
            df = pd.read_csv(io.StringIO(content.decode("utf-8")))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")

        # Basic validation: ensure required columns exist
        required_cols = {'gate_id', 'occupancy', 'queue_time'}
        if not required_cols.issubset(set(df.columns)):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV missing required columns. Expected: {required_cols}"
            )

        # Process the dataframe
        gates = []
        total_occupancy = 0
        for _, row in df.iterrows():
            occupancy = max(0, min(100, int(row['occupancy']))) # sanitize
            queue = max(0, int(row['queue_time']))
            
            gates.append(Gate(
                id=str(row['gate_id']),
                name=f"Gate {str(row['gate_id']).upper()}",
                occupancy_percentage=occupancy,
                queue_time_minutes=queue
            ))
            # Just an approximation: assume each 1% = 200 people for total count
            total_occupancy += (occupancy * 200) 

        if not gates:
            raise HTTPException(status_code=400, detail="CSV contained no valid gate data.")

        avg_queue = sum(g.queue_time_minutes for g in gates) // len(gates)

        # Dynamic Cost Metrics Calculation
        # Assume gates > 80% occupancy contribute to queue delays that can be avoided
        high_occupancy_gates = [g for g in gates if g.occupancy_percentage > 80]
        redirected_people = sum((g.occupancy_percentage - 80) * 200 for g in high_occupancy_gates)
        
        # Assume each redirected person saves 0.05 minutes of average queue time globally
        queue_reduction_minutes = int(redirected_people * 0.05)
        
        # Assume 1 hour of queue time saved equates to 0.5 hours of volunteer overtime saved
        overtime_saved_hours = int((queue_reduction_minutes / 60) * 0.5)
        
        # Assume volunteer overtime costs $25/hr
        cost_savings_usd = overtime_saved_hours * 25

        # Base efficiency is 85%, plus 1% for every 100 people effectively redirected
        efficiency = min(99, 85 + int(redirected_people / 100))

        # Update the live telemetry service
        telemetry = get_telemetry_service()
        telemetry.gates = gates
        telemetry.total_occupancy = total_occupancy
        telemetry.active_incidents = getattr(telemetry, 'active_incidents', 0)
        telemetry.cost_metrics.ai_routing_savings_usd = cost_savings_usd
        telemetry.cost_metrics.overtime_prevented_hours = overtime_saved_hours
        telemetry.cost_metrics.resource_efficiency_percentage = efficiency
        
        return telemetry.generate_live_state()
