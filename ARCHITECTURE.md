# CrowdPilot AI - Architecture & Tech Stack

## System Architecture

CrowdPilot AI is built using a strict **Clean Architecture** pattern to ensure maximum scalability, testability, and separation of concerns. The system is divided into decoupled layers.

### 1. Presentation Layer (Frontend)
The frontend is a strictly typed Next.js application that communicates with the backend via REST APIs. 
- **Role:** Handles UI rendering, state management, and real-time data visualization.
- **Key Components:**
  - `Decision Timeline`: Renders the complex Explainable AI (XAI) JSON responses into an intuitive, expandable timeline.
  - `Multilingual Assistant`: Captures audio/text for auto-detect translation.

### 2. API Layer (Backend)
The FastAPI routing layer (`app/api/`) exposes RESTful endpoints.
- **Role:** Handles HTTP requests, validates incoming payloads (using Pydantic), and routes them to the appropriate services. 
- **Key Components:**
  - `copilot.py`: Endpoints for XAI recommendations and incident reporting.
  - `deps.py`: Manages Dependency Injection for services and repositories.

### 3. Business Logic Layer
The Service layer (`app/services/`) contains the core orchestration logic.
- **Role:** Enforces business rules and orchestrates calls to external APIs (Gemini) and data repositories.
- **Key Components:**
  - `AIService`: Manages prompt engineering, RAG context injection, and structured JSON parsing from the Gemini API.

### 4. Data / Repository Layer
The Repository layer (`app/repositories/`) abstracts all database and external storage interactions.
- **Role:** Isolates the database implementation from the business logic.
- **Key Components:**
  - `VectorRepository`: Interfaces with ChromaDB for storing and retrieving historical context (Retrieval-Augmented Generation).

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library, jsdom

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn
- **Validation:** Pydantic
- **AI Integration:** Google Gemini SDK (`gemini-1.5-flash`)
- **Vector Database:** ChromaDB (for RAG)
- **Data Processing:** Pandas, NumPy, Scikit-learn (for analytics and CSV processing)
- **Testing:** Pytest, Pytest-cov, FastAPI TestClient
- **Performance Testing:** Locust
- **Linting & Formatting:** Black, flake8, isort, mypy

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

### 5. Enterprise-Grade QA Pipeline
- **>90% Target Backend Coverage** with offline mocking.
- **Automated CI/CD** via GitHub actions for linting, typing, and testing.
- **Load testing** ready for scaling up to thousands of concurrent volunteers.
