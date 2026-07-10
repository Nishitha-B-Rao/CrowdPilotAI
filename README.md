# CrowdPilot AI - Smart Stadium Operations

CrowdPilot AI is an advanced, Explainable AI (XAI) decision support platform designed specifically for FIFA World Cup 2026 stadium volunteers. It solves complex crowd management and multilingual assistance challenges by providing real-time, explainable recommendations based on live telemetry and historical RAG data.

## Features

- **Explainable AI (XAI) Core**: Every recommendation includes the Observation, Reasoning, Prediction, Action, and Expected Impact. Powered by Google Cloud's Vertex AI (Gemini 2.5 Flash).
- **Multilingual Assistant**: A fully functional, browser-native Speech-to-Text module (Web Speech API) that allows volunteers to speak foreign languages and automatically transcribe them for translation.
- **Incident Copilot**: Context-aware natural language interface for reporting emergencies.
- **Enterprise Engineering**: Built on a strict Clean Architecture pattern (FastAPI) and a modern Next.js React frontend.

---

## Directory Structure

The project is structured to strictly separate concerns to ensure scalability and testability:

### `/backend` (FastAPI)
The backend is built using a Clean Architecture approach:
- `app/main.py`: The entry point for the FastAPI application.
- `app/api/`: REST API endpoints and router configuration (e.g., `/copilot` for AI, `/upload` for CSVs).
- `app/services/`: Core business logic, orchestration, and AI model interactions (`ai_service.py`, `data_processing_service.py`).
- `app/repositories/`: Data access abstractions (e.g., Vector DB for RAG).
- `app/models/`: Pydantic schemas for request/response validation.
- `app/core/`: Security protocols, configuration management (`config.py`), and environment variables.

### `/frontend` (Next.js & React)
The frontend is a modern web app using TailwindCSS and Framer Motion:
- `src/app/page.tsx`: The main "Live Operations" Volunteer Dashboard.
- `src/app/layout.tsx`: The root layout defining the global HTML structure and fonts.
- `src/app/globals.css`: Global stylesheet containing custom Dark/Light mode overrides and premium glassmorphism styling.
- `src/components/Sidebar.tsx`: The dynamic, client-side navigation sidebar.
- `src/app/incident-copilot/`, `src/app/analytics/`, `src/app/cost-dashboard/`: Secondary pages for the full app experience.

---

## Quick Start & Google Cloud Setup

To use the full production-grade architecture, we use **Google Cloud Vertex AI** for enterprise reliability.

### 1. Google Cloud Authentication (Vertex AI)

Instead of using a standard API key, this project authenticates locally using Google Cloud Application Default Credentials (ADC).

1. **Install the Google Cloud CLI**: If you don't have it, install `gcloud` from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install).
2. **Create a Project**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
3. **Enable the API**: Search for "Vertex AI API" in the console and click **Enable**.
4. **Authenticate Locally**: Open your terminal and run:
   ```bash
   gcloud auth application-default login
   ```
   *This will open a browser window. Log in with your Google account and click Allow.*

### 2. Environment Setup

Copy the example `.env` file in the backend directory:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` and add your Google Cloud Project ID:
```env
GCP_PROJECT_ID="your-google-cloud-project-id"
GCP_LOCATION="us-central1"
```
*(Note: If `GCP_PROJECT_ID` is left empty, the app will attempt to fallback to `GEMINI_API_KEY` if provided).*

### 3. Run the Backend (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
# source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. Swagger documentation is available at `http://localhost:8000/docs`.

### 4. Run the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## How to Test

Quality Assurance and testing are first-class citizens in this project. 

### Backend Testing (Pytest)
The backend features comprehensive unit and integration tests with offline mocking.
```bash
cd backend
.\venv\Scripts\activate
# Run all tests with coverage report
pytest --cov=app --cov-report=term-missing
```

### Frontend Testing (Vitest)
The Next.js frontend uses Vitest and React Testing Library to verify component rendering and XAI pipeline interactions.
```bash
cd frontend
npm run test
npm run test:coverage
```
