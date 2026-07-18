# Deployment Guide (Google Cloud Run)

Since CrowdPilot AI is built with Next.js and FastAPI and relies heavily on Google Cloud Vertex AI, deploying to **Google Cloud Run** is the most native and scalable approach for production.

Both the `frontend` and `backend` directories already contain optimized `Dockerfile`s.

Follow these step-by-step instructions to deploy your application.

---

## 1. Prerequisites

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticate your CLI:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Enable the necessary APIs:
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com aiplatform.googleapis.com
   ```

---

## 2. Deploy the Backend (FastAPI)

The backend needs to be deployed first so you can get its public URL to pass to the frontend.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Deploy directly from source to Cloud Run. Cloud Run will automatically build the container using your `Dockerfile` and deploy it.
   ```bash
   gcloud run deploy crowdpilot-backend \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="GEMINI_API_KEY=your_api_key_here,PROJECT_ID=YOUR_PROJECT_ID"
   ```
3. Wait for the deployment to finish. The terminal will output a Service URL (e.g., `https://crowdpilot-backend-xyz.a.run.app`). **Copy this URL**.

---

## 3. Deploy the Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Deploy the frontend from source. You MUST pass the backend URL you copied in the previous step so the frontend knows where to send API requests.
   ```bash
   gcloud run deploy crowdpilot-frontend \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NEXT_PUBLIC_API_URL=https://crowdpilot-backend-xyz.a.run.app"
   ```
3. Wait for the deployment to finish. The terminal will output your final Frontend Service URL (e.g., `https://crowdpilot-frontend-xyz.a.run.app`).

---

## 4. Verification

1. Open your Frontend Service URL in the browser.
2. The Dashboard should load immediately.
3. Test the "Auto-Translate" microphone feature or upload a CSV to verify that the backend is successfully communicating with Google Cloud Vertex AI in your production environment!

---

### Why Cloud Run?
- **Zero Server Management:** Scales down to zero when not in use (saves cost) and scales up instantly during high traffic.
- **Stateless:** Perfectly matches our Next.js Server Components and FastAPI REST architecture.
- **Secure:** Automatically handles HTTPS/SSL and deeply integrates with GCP Application Default Credentials (ADC).
