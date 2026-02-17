# FoodVision

FoodVision is an AI-powered food analysis web app that recognizes food items from images and provides nutritional and calorie insights through a clean, responsive interface.

## Core Technologies

-   **Frontend:** Next.js, Tailwind CSS
-   **Backend:** FastAPI (Python)
-   **AI & Machine Learning:**
    -   **TensorFlow:** Local binary classification model to detect if an image contains food.
    -   **OpenRouter API:** Access to state-of-the-art Visual Language Models (VLM) for detailed food identification and Large Language Models (LLM) for summarizing nutritional data.
    -   **LangChain:** Orchestrates the AI workflows.

## Architecture

The application follows a client-server architecture:

1.  **Frontend (Next.js):** A responsive web interface for users to upload food images.
2.  **Backend (FastAPI):** An API server that handles image analysis requests.
3.  **Food Detection (TensorFlow):** A local filter that checks if the uploaded image actually contains food before expensive API calls are made.
4.  **VLM Analysis (OpenRouter):** Sends the image to a Vision Model to identify the food and estimate ingredients/nutrition.
5.  **Reasoning Engine (LangChain):** Processes the VLM's output to generate a structured, easy-to-read nutritional summary.

## Getting Started

### Prerequisites

-   Node.js and npm (for the frontend)
-   Python 3.8+ and pip (for the backend)
-   An API key from [OpenRouter](https://openrouter.ai/)

### Quick Start

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/foodvision.git
    cd foodvision
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    pip install -r requirements.txt
    cp .env.example .env
    # Edit .env and add your OPENROUTER_API_KEY
    uvicorn main:app --reload
    ```

3.  **Frontend Setup:**

    Open a new terminal window.

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Open the App:**

    Visit `http://localhost:3000` in your browser.

## Documentation

For more detailed information, please refer to the specific README files:

-   [Backend Documentation](./backend/README.md)
-   [Frontend Documentation](./frontend/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
