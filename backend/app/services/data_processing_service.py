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
        # Update the live telemetry service
        telemetry = get_telemetry_service()
        telemetry.gates = gates
        telemetry.total_occupancy = total_occupancy
        telemetry.active_incidents = getattr(telemetry, 'active_incidents', 0)
        
        return telemetry.generate_live_state()
