# FoodVision

FoodVision is an AI-powered food analysis web app that recognizes food items from images and provides nutritional and calorie insights through a clean, responsive interface.

## Core Technologies

-   **Frontend:** Next.js, Tailwind CSS
-   **Backend:** FastAPI (Python)
-   **Machine Learning:** TensorFlow
-   **Language Model Integration:** LangChain

## Architecture

The application follows a client-server architecture:

1.  **Frontend (Next.js):** A responsive web interface for users to upload food images.
2.  **Backend (FastAPI):** An API server that handles image analysis requests.
3.  **ML Model (TensorFlow/MobileNetV3):** A fine-tuned Convolutional Neural Network (CNN) for food classification.
4.  **Reasoning Engine (LangChain):** Combines the classification results with a nutritional database (USDA) to generate human-readable summaries.

## Getting Started

### Prerequisites

-   Node.js and npm (for the frontend)
-   Python 3.8+ and pip (for the backend)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/foodvision.git
    cd foodvision
    ```

2.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    ```

3.  **Backend Setup:**

    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    uvicorn main:app --reload
    ```

    The backend will be running at `http://localhost:8000`.

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

    Open `http://localhost:3000` in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
