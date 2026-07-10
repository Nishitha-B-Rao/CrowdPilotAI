from locust import HttpUser, task, between

class StadiumOperationsUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_dashboard(self):
        """Simulate loading the main dashboard metrics"""
        self.client.get("/")

    @task(1)
    def request_recommendation(self):
        """Simulate an incident copilot recommendation request"""
        payload = {
            "context": "Simulated incident at Gate C - Medical emergency reported by volunteer."
        }
        self.client.post("/api/v1/copilot/recommendation", json=payload)

# Run this using: locust -f locustfile.py --host=http://localhost:8000
