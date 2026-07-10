# CrowdPilot AI - Smart Stadium Operations

CrowdPilot AI is an advanced, Explainable AI (XAI) decision support platform designed specifically for FIFA World Cup 2026 stadium volunteers. It solves complex crowd management and multilingual assistance challenges by providing real-time, explainable recommendations based on live and historical data.

## Features

- **Explainable AI (XAI) Core**: Every recommendation includes the Observation, Reasoning, Prediction, Action, and Expected Impact.
- **Multilingual Assistant**: Supports live auto-detect translation for assisting international fans.
- **Incident Copilot**: Context-aware natural language interface for reporting emergencies.
- **Enterprise Engineering**: Built on a strict Clean Architecture pattern (FastAPI) and modern Next.js React frontend.

## Quick Start

### 1. Environment Setup

Copy the example `.env` file in the backend directory and add your Google Gemini API key:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` and set `GEMINI_API_KEY=your_key_here`. (If not set, the AI will gracefully fall back to mock data).

### 2. Run the Backend (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
# source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. Swagger documentation is available at `http://localhost:8000/docs`.

### 3. Run the Frontend (Next.js)

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

# Run style/linting checks
black --check app/
flake8 app/
mypy app/
```

### Frontend Testing (Vitest)

The Next.js frontend uses Vitest and React Testing Library to verify component rendering and XAI pipeline interactions.

```bash
cd frontend

# Run test suite
npm run test

# Run test suite with coverage
npm run test:coverage

# Run linter
npm run lint
```

### Performance Load Testing (Locust)

You can simulate thousands of concurrent users hitting the AI and dashboard endpoints to measure latency and memory consumption.

1. Ensure your backend is running (`uvicorn app.main:app`).
2. Open a new terminal and run:
```bash
cd backend
.\venv\Scripts\activate
locust -f locustfile.py
```
3. Navigate to `http://localhost:8089` in your browser to start the swarm.

---

## Clean Architecture

This project strictly separates concerns to ensure scalability and testability:
- `app/api/`: REST API endpoints and router configuration.
- `app/services/`: Core business logic, orchestration, and AI model interactions.
- `app/repositories/`: Data access abstractions (e.g., Vector DB for RAG).
- `app/core/`: Security protocols, configuration management, and environment variables.
