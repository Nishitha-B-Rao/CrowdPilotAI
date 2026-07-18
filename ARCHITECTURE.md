# CrowdPilot AI - Architecture & Tech Stack

## System Architecture

CrowdPilot AI is built using a strict **Clean Architecture** pattern to ensure maximum scalability, testability, and separation of concerns. The system is divided into decoupled layers.

### 1. Presentation Layer (Frontend)
The frontend is a strictly typed Next.js application leveraging the App Router. It uses **Server Components** for initial payload efficiency and lazy-loads interactive elements via `next/dynamic` to ensure rapid time-to-interactive.
- **Role:** Handles UI rendering, state management, and real-time data visualization.
- **Key Components:**
  - `Decision Timeline`: Renders the complex Explainable AI (XAI) JSON responses into an intuitive, expandable timeline.
  - `Multilingual Assistant`: Captures audio/text for auto-detect translation.

### 2. API Layer (Backend)
The FastAPI routing layer (`app/api/`) exposes RESTful endpoints.
- **Role:** Handles HTTP requests, validates incoming payloads (using Pydantic), and routes them to the appropriate services. 
- **Key Components:**
  - `dashboard.py`: Exposes a single, highly-efficient `/sync` endpoint that aggregates telemetry, AI logs, and real-time recommendations to drastically reduce network calls.
  - `copilot.py`: Asynchronous (`async def`) endpoints for XAI recommendations and incident reporting.
  - `deps.py`: Manages Dependency Injection for services and repositories.

### 3. Business Logic Layer
The Service layer (`app/services/`) contains the core orchestration logic.
- **Role:** Enforces business rules and orchestrates calls to external APIs (Gemini) and data repositories.
- **Key Components:**
  - `AIService`: Manages prompt engineering, RAG context injection, and structured JSON parsing from the Gemini API.

### 4. Data / Repository Layer
The architecture is designed to support a Repository layer for abstracting database storage, though for this prototype, data state is managed in-memory or via streaming CSVs to focus on real-time GenAI orchestration.
- **Key Components:**
  - `DataProcessingService`: Handles the ingestion, parsing, and streaming of operational files (crowd density, incident reports).

---

## Technical Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, custom Glassmorphism
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Server:** Uvicorn
- **Validation:** Pydantic v2
- **AI Integration:** Google GenAI SDK (`gemini-2.5-flash-8b`)
- **Data Processing:** Pandas (for analytics and CSV processing)
- **Testing:** Pytest, FastAPI TestClient

---

## Core Features

### 1. Explainable AI (XAI) Decision Timeline
Instead of simply automating a decision, the AI acts as a transparent copilot. Every recommendation outputs a structured timeline:
- **Observation:** Real-time data trigger (e.g., "Gate C at 84% capacity").
- **Reasoning:** Step-by-step logic explaining *why* the AI is concerned.
- **Prediction:** The forecasted outcome if no action is taken.
- **Action & Impact:** The recommended mitigation strategy.

### 2. Multilingual Assistant
Designed for an international audience at the World Cup, this feature auto-detects fan languages and translates volunteer instructions, preserving context during medical or security emergencies.

### 3. Incident Copilot
A specialized interface where volunteers can report unstructured events ("Person collapsed near Gate B"). The AI immediately prioritizes the incident, suggests medical protocols, and alerts the nearest response team.

### 4. CSV Batch Analysis & Synthetic Data Streaming
The system can process uploaded CSVs (Crowd Density, Gate Occupancy, Volunteer Reports) to perform batch predictions, or fall back to a real-time synthetic data stream mimicking live stadium conditions.

### 5. Cloud-Native Readiness
- **Dockerized**: Fully containerized backend and frontend.
- **Stateless Architecture**: Built for horizontal scaling on Google Cloud Run.
- **Robust Testing**: Comprehensive Pytest suite covering backend core AI integration logic.
