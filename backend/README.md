# FoodVision Backend

The backend for FoodVision, an AI-powered food analysis application. It provides an API to analyze food images, detect food items, and estimate nutritional information.

## Technologies

-   **FastAPI:** High-performance web framework for building APIs with Python.
-   **TensorFlow (Local):** Used for the initial **fast, on-device** binary food detection to ensure low-latency filtering.
-   **LangChain:** Orchestrates the interaction between the VLM and the nutritional analysis.
-   **Groq API (Cloud):** Provides extremely fast inference for:
    -   **VLM (Visual Language Model):** Identifies food items and provides initial nutritional estimates.
    -   **LLM (Large Language Model):** Generates a comprehensive and structured nutritional summary.

## Prerequisites

-   Python 3.8 or higher
-   pip (Python package installer)

## Installation

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

2.  Open `.env` and configure the following variables:
    -   `GROQ_API_KEY`: **(Required)** Your API key from [Groq](https://console.groq.com/).
    -   `GROQ_VLM_MODEL`: (Optional) The Vision model to use (default: `llama-3.2-90b-vision-preview`).
    -   `GROQ_LLM_MODEL`: (Optional) The LLM model to use for summary generation (default: `llama-3.3-70b-versatile`).
    -   `USDA_API_KEY`: **(Required)** Your API key from USDA FoodData Central (used for precise nutritional lookup).

## Running the Server

Start the backend server using `uvicorn`:

```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`.

## API Documentation

### POST `/api/analyze`

Analyzes an uploaded image file.

-   **Request:** `multipart/form-data`
    -   `file`: The image file (JPEG, PNG, GIF, WEBP). Max size: 5MB.
-   **Response:** JSON object containing the analysis result.
    ```json
    {
      "food_item": "Grilled Chicken Salad",
      "description": "...",
      "details": {
        "Calories": "350 kcal",
        "Protein": "30 g",
        "Carbohydrates": "12 g",
        "Fat": "15 g"
      }
    }
    ```

## Project Structure

-   `main.py`: The entry point for the FastAPI application.
-   `food_detector.py`: Handles binary food detection using Groq Vision.
-   `vlm_analyzer.py`: Interacts with the Groq VLM to analyze images.
-   `langchain_orchestrator.py`: Uses LangChain and Groq to process VLM output and generate a structured summary.
-   `nutrition_analyzer.py`: Helper class for nutritional data lookup (using USDA API).
