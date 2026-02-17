import logging
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pathlib import Path
from dotenv import load_dotenv # New import

# Load environment variables from .env file
load_dotenv() # New call

from nutrition_analyzer import NutritionAnalyzer
from food_detector import FoodDetector
from vlm_analyzer import VLMAnalyzer
from langchain_orchestrator import LangChainOrchestrator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Initialize FoodDetector (assuming model path is configured)
food_detector = FoodDetector()

# Initialize VLMAnalyzer
vlm_analyzer = VLMAnalyzer()

# Initialize NutritionAnalyzer
nutrition_analyzer = NutritionAnalyzer()

# Initialize LangChainOrchestrator
langchain_orchestrator = LangChainOrchestrator(nutrition_analyzer)

# Add CORS middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE_MB = 5
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # 1. File type validation
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Only {', '.join(ALLOWED_IMAGE_TYPES)} are allowed."
        )

    temp_file_path = Path(f"temp_{file.filename}")
    try:
        file_content = await file.read()
        # 2. File size validation
        if len(file_content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds the limit of {MAX_FILE_SIZE_MB}MB."
            )

        with open(temp_file_path, "wb") as buffer:
            buffer.write(file_content)

        # 1. Initial Food Detection
        if not food_detector.is_food(str(temp_file_path)):
            logger.info(f"No food detected in {file.filename}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No food detected in the uploaded image. Please upload an image containing food."
            )

        # 2. Detailed Food Identification and Contextual Analysis using VLM
        try:
            vlm_analysis_result = vlm_analyzer.analyze_image_with_vlm(str(temp_file_path))
            food_item = vlm_analysis_result.get("food_item_vlm", "Unknown Food")
            logger.info(f"VLM identified food item: {food_item}")
        except Exception as e:
            logger.exception(f"Error during VLM analysis for {file.filename}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to perform detailed food analysis."
            )

        # 3. Generate Comprehensive Nutritional Summary using LangChainOrchestrator
        try:
            analysis_result = langchain_orchestrator.generate_comprehensive_summary(vlm_analysis_result)
            logger.info("Comprehensive nutritional summary generated.")
        except Exception as e:
            logger.exception("Error during LangChain orchestration for summary generation.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate comprehensive nutritional summary."
            )

        return analysis_result
    finally:
        if temp_file_path.exists():
            temp_file_path.unlink()
