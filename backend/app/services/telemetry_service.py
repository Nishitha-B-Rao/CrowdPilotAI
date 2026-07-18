import random
from typing import List

from app.models.telemetry import Gate, StadiumState


class TelemetryService:
    def __init__(self):
        # Initial base state
        self.gates: List[Gate] = [
            Gate(id="gate_a", name="Gate A", occupancy_percentage=30, queue_time_minutes=5),
            Gate(id="gate_b", name="Gate B", occupancy_percentage=45, queue_time_minutes=8),
            Gate(id="gate_c", name="Gate C", occupancy_percentage=85, queue_time_minutes=18),
            Gate(id="gate_d", name="Gate D", occupancy_percentage=20, queue_time_minutes=3),
            Gate(id="south_hub", name="South Transit Hub", occupancy_percentage=60, queue_time_minutes=12),
        ]
        self.total_occupancy = 68402
        self.active_incidents = 3
        self.ai_logs = []

    def generate_live_state(self) -> StadiumState:
        """
        Simulate fluctuating live data.
        In a real application, this would pull from IoT sensors or a database.
        """
        # Add some random fluctuations
        for gate in self.gates:
            gate.occupancy_percentage = max(0, min(100, gate.occupancy_percentage + random.randint(-5, 5)))
            gate.queue_time_minutes = max(0, gate.queue_time_minutes + random.randint(-2, 2))

        # Fluctuate overall metrics slightly
        self.total_occupancy += random.randint(-50, 200)
        
        # Chance to resolve or create an incident
        if random.random() > 0.8:
            self.active_incidents = max(0, self.active_incidents + random.choice([-1, 1]))

        avg_queue = sum(g.queue_time_minutes for g in self.gates) // len(self.gates)

        return StadiumState(
            total_occupancy=self.total_occupancy,
            active_incidents=self.active_incidents,
            avg_queue_time=avg_queue,
            gates=self.gates
        )
