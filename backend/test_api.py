import requests
import json

try:
    res1 = requests.get("http://localhost:8000/api/v1/telemetry/state")
    print(f"Telemetry GET: {res1.status_code}")
    state = res1.json()

    res2 = requests.post(
        "http://localhost:8000/api/v1/copilot/recommendation",
        json={"context": json.dumps(state)}
    )
    print(f"Copilot POST: {res2.status_code}")
    print(res2.text)
except Exception as e:
    print(e)
