# Gemini Context: Food Vision

Food Vision is a full-stack AI-powered application designed for food detection and nutrition analysis. It uses a combination of local machine learning models and state-of-the-art Visual Language Models (VLM) via the OpenRouter API.

## Project Overview

- **Purpose:** Analyze food images to identify items and provide nutritional summaries (calories, protein, fats, carbs).
- **Architecture:** 
    - **Frontend:** Next.js (App Router) with Tailwind CSS and TypeScript.
    - **Backend:** FastAPI (Python) orchestrating multiple analysis stages.
- **AI Workflow:**
    1. **Local Filter:** A TensorFlow binary classifier (`backend/food_detector.py`) checks if the image contains food.
    2. **VLM Identification:** If food is detected, the image is sent to a VLM (e.g., Gemini or Nemotron via OpenRouter) to identify specific food items and estimate nutrition.
    3. **LLM Refinement:** LangChain orchestrates a final LLM pass to structure and summarize the nutritional data into a user-friendly format.

## Technologies

### Backend (Python)
- **Framework:** FastAPI
- **AI/ML:** TensorFlow (local model), LangChain, LangGraph
- **API Connectivity:** OpenRouter (accessing VLM/LLM models)
- **Image Processing:** PIL (Pillow)
- **Configuration:** `python-dotenv` for environment variables.

### Frontend (TypeScript/React)
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Tooling:** ESLint, PostCSS

## Building and Running

### Backend
1. **Navigate:** `cd backend`
2. **Install Dependencies:** `pip install -r requirements.txt`
3. **Environment Setup:**
   - `cp .env.example .env`
   - Set `OPENROUTER_API_KEY` in `.env`.
4. **Run Server:** `uvicorn main:app --reload`
   - Access API docs at `http://localhost:8000/docs`

### Frontend
1. **Navigate:** `cd frontend`
2. **Install Dependencies:** `npm install`
3. **Run Development Server:** `npm run dev`
   - Access application at `http://localhost:3000`

## Development Conventions

- **Type Safety:** Use TypeScript for all frontend components and Pydantic/Type Hinting for Python backend logic.
- **Logging:** Use Python's standard `logging` module in the backend for visibility into AI workflows.
- **Modularity:** Maintain the separation of concerns between `food_detector`, `vlm_analyzer`, and `langchain_orchestrator`.
- **Styling:** Adhere to Tailwind CSS utility classes and modern React patterns.
- **Error Handling:** Ensure robust error handling for API calls (OpenRouter) and file uploads (size and type validation).

## Key Files
- `backend/main.py`: FastAPI entry point and orchestration logic.
- `backend/food_detector.py`: Local TensorFlow model wrapper for binary classification.
- `backend/vlm_analyzer.py`: Integration with OpenRouter for image analysis.
- `backend/langchain_orchestrator.py`: Logic for generating structured nutritional summaries.
- `frontend/src/app/page.tsx`: Main UI entry point.
- `frontend/src/components/`: UI components for upload and results display.
