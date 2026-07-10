# CrowdPilot AI: Features & Architecture

CrowdPilot AI is an AI-powered operations dashboard built to manage crowd dynamics, volunteer routing, and incident response for the FIFA World Cup 2026. 

To demonstrate both the technical rigor and the scalable vision of the platform, the application contains a mix of **Fully Functional AI Pipelines** (backed by Google Vertex AI) and **Future-ready modules with simulated operational data**.

---

## 1. Fully Functional Modules (Powered by API / Python)

These modules are 100% functional, wired to the backend, and powered by Google Cloud Vertex AI (`gemini-2.5-flash`).

### A. Explainable AI (XAI) Decision Engine
* **Location**: Main Dashboard (`/`)
* **How it works**: The backend continuously ingests crowd telemetry data. Instead of providing a "black box" instruction, Vertex AI generates a transparent **Decision Chain**:
  - `Observation`: What is currently happening (e.g., Gate C at 92%).
  - `Reasoning`: Why the AI is making the recommendation.
  - `Prediction`: What happens if no action is taken.
  - `Recommendation`: The exact action the volunteer should take.
  - `Expected Impact`: The measurable result of the action.

### B. Live Translation Module (Auto-Translate)
* **Location**: Main Dashboard (`/`), Microphone Button
* **How it works**: Uses the browser's native Web Speech API to transcribe a fan's voice (e.g., a Spanish-speaking fan asking for directions). The transcript is sent to a dedicated `/api/v1/copilot/translate` backend endpoint. Vertex AI detects the source language and returns an English translation in real-time, bridging the language barrier for volunteers.

### C. CSV Telemetry Ingestion
* **Location**: Main Dashboard (`/`), Upload CSV Button
* **How it works**: Simulates real-time hardware sensors. You can upload a CSV containing `gate_id`, `occupancy`, and `queue_time`. The Python backend parses the data, updates the in-memory Stadium State, recalculates total stadium occupancy, and immediately triggers Vertex AI to generate a new, context-aware routing recommendation.

---

## 2. Dynamic Operational Modules

These modules demonstrate the long-term vision, commercial viability, and UI/UX capability of the product. By uploading operational CSV files, these modules compute dynamic metrics and generate real AI insights, rather than relying on hardcoded static data.

### A. Cost Optimization Dashboard
* **Location**: Sidebar -> Cost Dashboard (`/cost-dashboard`)
* **Purpose**: Demonstrates the commercial viability of the platform to stakeholders. It dynamically visualizes AI Routing Savings, Overtime Prevented, and Resource Efficiency based on the live crowd telemetry.

### B. Incident Copilot & Decision Timeline
* **Location**: Sidebar -> Incident Copilot (`/incident-copilot`)
* **Purpose**: A dedicated view for handling emergencies (Medical, Security). 
* **How it works**: Upload `incidents.csv` to seamlessly pass real-time incident reports to Vertex AI, which assigns priorities, generates reasoning, and provides dispatch action scripts dynamically.

### C. Live Heatmap Analytics
* **Location**: Main Dashboard & Analytics Page (`/analytics`)
* **Purpose**: Visually represents stadium density.
* **Status**: Dynamic generation based on telemetry data.
