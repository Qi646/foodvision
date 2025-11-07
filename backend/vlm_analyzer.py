import logging
from typing import Dict, Any
from PIL import Image
import io
import os
import requests
import base64
import json

logger = logging.getLogger(__name__)

class VLMAnalyzer:
    def __init__(self):
        """
        Initializes the VLMAnalyzer with OpenRouter API.
        This class will handle interactions with a Visual Language Model (VLM)
        for detailed food identification and contextual analysis.
        """
        logger.info("VLMAnalyzer initialized. Initializing OpenRouter API.")
        
        self.OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
        if not self.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY environment variable not set. Please provide your OpenRouter API key.")
        
        self.OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
        # Choose a vision-capable model from OpenRouter. Example: google/gemini-pro-vision, openai/gpt-4o
        self.OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "nvidia/nemotron-nano-12b-v2-vl:free")
        
        self.headers = {
            "Authorization": f"Bearer {self.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }
        logger.info(f"OpenRouter VLM configured with model: {self.OPENROUTER_MODEL}")

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
        Analyzes an image using the OpenRouter VLM to identify food items,
        extract contextual information, and provide nutritional estimates.

        Args:
            image_path: The path to the image file.

        Returns:
            A dictionary containing the VLM's analysis, including identified food items,
            description, and nutritional estimates.
        """
        logger.info(f"Analyzing image {image_path} with OpenRouter VLM.")
        
        try:
            base64_data_url = self._encode_image_to_base64_data_url(image_path)

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this image of food. Identify all food items in the image and provide a combined nutritional estimate for all of them. Present the total nutritional estimates clearly in a structured format. Each item should be on a new line, like this:\nFood Item: [list of all food items]\nCalories: [total value]\nProtein: [total value]\nCarbohydrates: [total value]\nFat: [total value]"},
                        {
                            "type": "image_url",
                            "image_url": {"url": base64_data_url},
                        },
                    ],
                }
            ]

            payload = {
                "model": self.OPENROUTER_MODEL,
                "messages": messages,
            }

            response = requests.post(self.OPENROUTER_API_URL, headers=self.headers, json=payload)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            response_json = response.json()
            vlm_text_response = response_json["choices"][0]["message"]["content"]
            logger.info(f"OpenRouter VLM raw response: {vlm_text_response}")

            # Parse the VLM's response
            food_item = "Unknown Food"
            description = vlm_text_response
            vlm_nutritional_estimates = {}

            # Robust parsing based on the structured format requested in the prompt
            lines = vlm_text_response.split('\n')
            for line in lines:
                if line.startswith("Food Item:"):
                    food_item = line.split("Food Item:", 1)[-1].strip()
                elif line.startswith("Calories:"):
                    vlm_nutritional_estimates["calories"] = line.split("Calories:", 1)[-1].strip()
                elif line.startswith("Protein:"):
                    vlm_nutritional_estimates["protein"] = line.split("Protein:", 1)[-1].strip()
                elif line.startswith("Carbohydrates:"):
                    vlm_nutritional_estimates["carbohydrates"] = line.split("Carbohydrates:", 1)[-1].strip()
                elif line.startswith("Fat:"):
                    vlm_nutritional_estimates["fat"] = line.split("Fat:", 1)[-1].strip()
            
            # If food_item wasn't explicitly found, try to infer from first line or general description
            if food_item == "Unknown Food" and lines:
                first_line_content = lines[0].strip()
                if first_line_content and not first_line_content.startswith("Calories:") and not first_line_content.startswith("Protein:"):
                    food_item = first_line_content.split(':', 1)[-1].strip() if ':' in first_line_content else first_line_content
                    if len(food_item.split()) > 5: # Avoid using a long sentence as food_item
                        food_item = "Unknown Food"

            return {
                "food_item_vlm": food_item,
                "description": vlm_text_response, # Keep full response for context
                "vlm_nutritional_estimates": vlm_nutritional_estimates
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"OpenRouter API request failed: {e}")
            if response is not None:
                logger.error(f"Response status code: {response.status_code}")
                logger.error(f"Response body: {response.text}")
            return {
                "food_item_vlm": "Unknown Food",
                "description": f"Failed to analyze image with VLM (API error): {e}",
                "vlm_nutritional_estimates": {}
            }
        except Exception as e:
            logger.error(f"Error during VLM analysis or parsing: {e}")
            return {
                "food_item_vlm": "Unknown Food",
                "description": f"Failed to analyze image with VLM: {e}",
                "vlm_nutritional_estimates": {}
            }
