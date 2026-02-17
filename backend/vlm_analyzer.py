import logging
from typing import Dict, Any
from PIL import Image
import io
import os
import base64
import json

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

logger = logging.getLogger(__name__)

class VLMAnalyzer:
    def __init__(self):
        """
        Initializes the VLMAnalyzer with Groq API.
        This class will handle interactions with a Visual Language Model (VLM)
        for detailed food identification and contextual analysis.
        """
        logger.info("VLMAnalyzer initialized. Initializing Groq API.")
        
        self.GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY environment variable not set. Please provide your Groq API key.")
        
        # Default to a Groq vision model (e.g., llama-3.2-90b-vision-preview)
        self.GROQ_VLM_MODEL = os.environ.get("GROQ_VLM_MODEL", "llama-3.2-90b-vision-preview")
        
        self.llm = ChatGroq(
            temperature=0,
            model_name=self.GROQ_VLM_MODEL,
            api_key=self.GROQ_API_KEY
        )
        logger.info(f"Groq VLM configured with model: {self.GROQ_VLM_MODEL}")

    def _encode_image_to_base64_data_url(self, image_path: str) -> str:
        """
        Encodes an image file to a base64 data URL.
        """
        try:
            img = Image.open(image_path)
            img_byte_arr = io.BytesIO()
            img_format = img.format if img.format else 'JPEG'
            img.save(img_byte_arr, format=img_format)
            base64_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
            return f"data:image/{img_format.lower()};base64,{base64_image}"
        except Exception as e:
            logger.error(f"Error encoding image {image_path} to base64: {e}")
            raise

    def analyze_image_with_vlm(self, image_path: str) -> Dict[str, Any]:
        """
        Analyzes an image using the Groq VLM to identify food items,
        extract contextual information, and provide nutritional estimates.

        Args:
            image_path: The path to the image file.

        Returns:
            A dictionary containing the VLM's analysis, including identified food items,
            description, and nutritional estimates.
        """
        logger.info(f"Analyzing image {image_path} with Groq VLM.")
        
        try:
            base64_data_url = self._encode_image_to_base64_data_url(image_path)

            message = HumanMessage(
                content=[
                    {
                        "type": "text", 
                        "text": "Analyze this image of food. Identify all food items in the image and provide a combined nutritional estimate for all of them. Present the total nutritional estimates clearly in a structured format. Each item should be on a new line, like this:\nFood Item: [list of all food items]\nCalories: [total value]\nProtein: [total value]\nCarbohydrates: [total value]\nFat: [total value]"
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": base64_data_url},
                    },
                ]
            )

            response = self.llm.invoke([message])
            vlm_text_response = response.content
            logger.info(f"Groq VLM raw response: {vlm_text_response}")

            # Parse the VLM's response
            food_item = "Unknown Food"
            description = vlm_text_response
            vlm_nutritional_estimates = {}

            # Robust parsing based on the structured format requested in the prompt
            lines = vlm_text_response.split('\n')
            for line in lines:
                line = line.strip()
                if line.lower().startswith("food item:"):
                    food_item = line.split(":", 1)[-1].strip()
                elif line.lower().startswith("calories:"):
                    vlm_nutritional_estimates["calories"] = line.split(":", 1)[-1].strip()
                elif line.lower().startswith("protein:"):
                    vlm_nutritional_estimates["protein"] = line.split(":", 1)[-1].strip()
                elif line.lower().startswith("carbohydrates:"):
                    vlm_nutritional_estimates["carbohydrates"] = line.split(":", 1)[-1].strip()
                elif line.lower().startswith("fat:"):
                    vlm_nutritional_estimates["fat"] = line.split(":", 1)[-1].strip()
            
            # If food_item wasn't explicitly found, try to infer from first line or general description
            if food_item == "Unknown Food" and lines:
                first_line_content = lines[0].strip()
                if first_line_content and not any(kw in first_line_content.lower() for kw in ["calories:", "protein:"]):
                    possible_food = first_line_content.split(':', 1)[-1].strip() if ':' in first_line_content else first_line_content
                    # Simple heuristic to avoid picking up long descriptions as food name
                    if len(possible_food.split()) <= 10: 
                        food_item = possible_food

            return {
                "food_item_vlm": food_item,
                "description": vlm_text_response, # Keep full response for context
                "vlm_nutritional_estimates": vlm_nutritional_estimates
            }

        except Exception as e:
            logger.error(f"Error during VLM analysis or parsing: {e}")
            return {
                "food_item_vlm": "Unknown Food",
                "description": f"Failed to analyze image with VLM: {e}",
                "vlm_nutritional_estimates": {}
            }
