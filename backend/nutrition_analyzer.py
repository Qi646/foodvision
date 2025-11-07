import logging
import os
import requests
import json
from langchain.tools import tool
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class NutritionAnalyzer:
    def __init__(self):
        self.api_key = os.environ.get("USDA_API_KEY")
        if not self.api_key:
            raise ValueError("USDA_API_KEY environment variable not set.")

    def search_food_data(self, query: str) -> str:
        """
        Searches the USDA FoodData Central API for food items based on a query.
        Returns a JSON string of the search results.
        """
        base_url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "query": query,
            "api_key": self.api_key,
            "pageSize": 1, # Limit to the most relevant result
        }

        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.text
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error making API request to USDA FoodData Central: {e}"
            )

    def get_nutritional_summary(self, food_item: str) -> dict:
        logger.info(f"NutritionAnalyzer: Getting nutritional summary for {food_item}...")
        search_results = self.search_food_data(query=food_item)
        logger.info(f"NutritionAnalyzer: Raw search results for {food_item}: {search_results}")
        
        try:
            data = json.loads(search_results)
            foods = data.get("foods", [])
            if foods:
                first_food = foods[0]
                food_name = first_food.get("description", "N/A")
                nutrients = {nutrient["nutrientName"]: nutrient for nutrient in first_food.get("foodNutrients", [])}

                calories = nutrients.get("Energy", {}).get("value", "N/A")
                protein = nutrients.get("Protein", {}).get("value", "N/A")
                carbohydrates = nutrients.get("Carbohydrate, by difference", {}).get("value", "N/A")
                fat = nutrients.get("Total lipid (fat)", {}).get("value", "N/A")

                calories_unit = nutrients.get("Energy", {}).get("unitName", "KCAL")
                protein_unit = nutrients.get("Protein", {}).get("unitName", "G")
                carbohydrates_unit = nutrients.get("Carbohydrate, by difference", {}).get("unitName", "G")
                fat_unit = nutrients.get("Total lipid (fat)", {}).get("unitName", "G")

                summary = (
                    f"A {food_name} contains approximately "
                    f"{calories}{calories_unit} calories, "
                    f"{protein}{protein_unit} protein, "
                    f"{carbohydrates}{carbohydrates_unit} carbohydrates, and "
                    f"{fat}{fat_unit} fat (per 100g)."
                )
                
                details = {
                    "calories": f"{calories} {calories_unit}",
                    "protein": f"{protein} {protein_unit}",
                    "carbohydrates": f"{carbohydrates} {carbohydrates_unit}",
                    "fat": f"{fat} {fat_unit}"
                }
                logger.info(f"NutritionAnalyzer: Parsed summary for {food_item}: {summary}")
                logger.info(f"NutritionAnalyzer: Parsed details for {food_item}: {details}")
                return {"summary": summary, "details": details}
            else:
                logger.info(f"NutritionAnalyzer: No nutritional information found for {food_item}.")
                return {"summary": f"No nutritional information found for {food_item}.", "details": {}}
        except json.JSONDecodeError:
            logger.error(f"NutritionAnalyzer: Error parsing USDA FoodData Central API response for {food_item}.")
            return {"summary": f"Error parsing USDA FoodData Central API response for {food_item}.", "details": {}}
