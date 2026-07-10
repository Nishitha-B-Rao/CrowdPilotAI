# Testing Guide - CrowdPilot AI

CrowdPilot AI is built with reliability in mind, utilizing robust testing frameworks for both the frontend and backend to ensure the Explainable AI (XAI) pipeline and telemetry processing remain stable in high-stress stadium environments.

---

## 1. Backend Testing (Pytest)

The FastAPI backend uses `pytest` for unit and integration testing. The test suite focuses heavily on the Data Processing Service and the AI Copilot reasoning endpoints to guarantee that edge cases (such as malformed CSV uploads) do not crash the live dashboard.

### Running Backend Tests

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Ensure you are in your Python virtual environment (if applicable) and have installed the test dependencies from `requirements.txt`.

3. Run the test suite:
   ```bash
   pytest tests/ -v
   ```

### What is tested?
- **`test_services.py`**: Validates the core `DataProcessingService`, ensuring that required CSV columns are verified, and queue times/occupancy metrics aggregate correctly. It also mocks the Vertex AI responses.
- **`test_ai_service.py`**: A specialized test suite for the `AIService` ensuring that the Pandas/CSV summarization logic can elegantly handle corrupted or non-standard incident reports without throwing unhandled exceptions.

---

## 2. Frontend Testing (Vitest + React Testing Library)

The Next.js frontend uses **Vitest** combined with **React Testing Library** for lightning-fast component testing. This ensures our highly modular React components render their XAI data accurately.

### Running Frontend Tests

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```

3. Run the Vitest test suite:
   ```bash
   npm run test
   ```
   *(To run tests in watch mode during development, use `npm run test:watch` if configured in package.json)*

### What is tested?
- **`__tests__/DecisionTimeline.test.tsx`**: Mounts the Incident Copilot page and validates that the XAI reasoning cards and layout render properly.
- **`__tests__/page.test.tsx`**: Tests the core dashboard rendering.
- **`__tests__/Analytics.test.tsx`**: Validates the rendering of historical and analytical routing views.

---

## 3. End-to-End & Manual Testing

For a full manual end-to-end (E2E) test of the live application on your local machine:

### Starting the Local Environment

1. **Start the Backend (FastAPI)**
   Open a terminal and run:
   ```bash
   cd backend
   
   # Create and activate a virtual environment
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate
   
   # Install dependencies and run the server
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The backend will be available at http://localhost:8000*

2. **Start the Frontend (Next.js)**
   Open a second terminal and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be available at http://localhost:3000*

### Running the Manual Test

1. Open http://localhost:3000 in your browser.
2. In the frontend, use the **CSV Uploader** located on the right side of the dashboard.
3. Upload `mock_data/crowd_02_halftime_surge.csv`.
4. **Expected Result**: 
   - The Heatmap will instantly update to show high occupancy at specific gates.
   - The AI Activity Log will show a Vertex AI stream.
   - A new card will appear in the **Explainable AI Decision Timeline** with a specific Observation, Reasoning, Prediction, Recommendation, and Expected Impact.
