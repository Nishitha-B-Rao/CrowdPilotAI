from typing import List

from pydantic import BaseModel, Field


class Gate(BaseModel):
    id: str = Field(..., description="Unique identifier for the gate")
    name: str = Field(..., description="Display name of the gate")
    occupancy_percentage: int = Field(..., description="Current occupancy as a percentage")
    queue_time_minutes: int = Field(..., description="Current average wait time in minutes")

class StadiumState(BaseModel):
    total_occupancy: int = Field(..., description="Total stadium occupancy")
    active_incidents: int = Field(..., description="Total active incidents")
    avg_queue_time: int = Field(..., description="Average queue time across all gates")
    gates: List[Gate] = Field(..., description="List of all gates and their current status")
