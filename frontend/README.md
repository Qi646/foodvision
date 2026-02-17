# FoodVision Frontend

The frontend for FoodVision, built with Next.js and Tailwind CSS. It provides a user-friendly interface for uploading food images and viewing nutritional analysis results.

## Technologies

-   **Next.js:** React framework for building the web application.
-   **Tailwind CSS:** Utility-first CSS framework for styling.
-   **TypeScript:** For type safety and better developer experience.

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, pnpm, or bun

## Installation

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

## Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Configuration

The frontend is configured to communicate with the backend at `http://localhost:8000`. Ensure the backend server is running before using the application.

## Project Structure

-   `src/app/page.tsx`: The main page of the application.
-   `src/components/`: Reusable React components.
    -   `ImageUpload.tsx`: Handles file selection and drag-and-drop.
    -   `ImageDisplay.tsx`: Displays the uploaded image.
    -   `AnalysisResult.tsx`: Renders the nutritional analysis data.
