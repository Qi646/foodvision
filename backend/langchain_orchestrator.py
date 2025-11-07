import logging
from typing import Dict, Any
import os
import re

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI # Using ChatOpenAI for OpenRouter compatibility
from langchain.agents import create_agent

logger = logging.getLogger(__name__)

class LangChainOrchestrator:
    def __init__(self, nutrition_analyzer_instance):
        """
        Initializes the LangChainOrchestrator.
        This class will orchestrate VLM output, nutritional data retrieval, and insight generation
        using a LangChain agent.

        Args:
            nutrition_analyzer_instance: An instance of NutritionAnalyzer to fetch raw nutritional data.
        """
        self.nutrition_analyzer = nutrition_analyzer_instance
        logger.info("LangChainOrchestrator initialized. Setting up LangChain agent.")

        # 1. Initialize LLM (using OpenRouter)
        openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set for LangChain Orchestrator.")
        
        openrouter_llm_model = os.environ.get("OPENROUTER_LLM_MODEL", "minimax/minimax-m2:free")

        self.llm = ChatOpenAI(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=openrouter_api_key,
            model_name=openrouter_llm_model,
            temperature=0.2 # Keep temperature low for factual responses
        )
        logger.info(f"OpenRouter LLM configured with model: {openrouter_llm_model}")

        # 2. Create Tools
        self.tools = [
            Tool(
                name="Nutrition_Analyzer",
                func=self.nutrition_analyzer.get_nutritional_summary,
                description="Useful for getting nutritional information for a given food item. Input should be a single food item name (string)."
            )
        ]

        # 3. Define the Agent's Prompt
        system_prompt = "You are a highly accurate and concise nutritional analyst. Your primary goal is to provide the total nutritional information for all food items identified by the VLM. You MUST use the 'Nutrition_Analyzer' tool for each food item to retrieve precise data for Calories, Protein, Carbohydrates, and Fat. After obtaining the data for all food items, you MUST calculate the total nutritional values. Your final output should explicitly list the total nutritional facts in the format: '**Total Nutritional Facts**:\n- **Calories**: X kcal\n- **Protein**: Y g\n- **Carbohydrates**: Z g\n- **Fat**: A g'. If a nutrient is not available, state 'N/A'. Do NOT include any descriptive text or additional information."

        # 4. Create the Agent
        self.agent = create_agent(
            model=self.llm,
            tools=self.tools,
            system_prompt=system_prompt,
        )

    def generate_comprehensive_summary(self, vlm_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a comprehensive nutritional summary using VLM analysis and a LangChain agent,
        then parses the detailed output for simple facts.

        Args:
            vlm_analysis: The output from the VLMAnalyzer, containing identified food items and context.

        Returns:
            A dictionary containing the food item, description, and nutritional details.
        """
        logger.info("Generating comprehensive summary with LangChainOrchestrator using agent.")
        
        food_item = vlm_analysis.get("food_item_vlm", "Unknown Food")
        vlm_description = vlm_analysis.get("description", "")

        try:
            # Invoke the LangChain agent to get a detailed response
            agent_response = self.agent.invoke({
                "messages": [("human", f"The VLM identified the following food: {food_item}. Additional VLM context: {vlm_description}. Please provide a comprehensive nutritional analysis.")]
            })
            detailed_output = agent_response["messages"][-1].content
            logger.info(f"LangChain Agent detailed output: {detailed_output}")

            # Parse the detailed output for nutritional facts
            description = ""
            details = {}

            nutritional_facts_str = detailed_output

            # Parse nutritional facts
            calories_match = re.search(r"- \*\*Calories\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if calories_match: details["Calories"] = calories_match.group(1).strip()

            protein_match = re.search(r"- \*\*Protein\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if protein_match: details["Protein"] = protein_match.group(1).strip()

            carbohydrates_match = re.search(r"- \*\*Carbohydrates\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if carbohydrates_match: details["Carbohydrates"] = carbohydrates_match.group(1).strip()

            fat_match = re.search(r"- \*\*Fat\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if fat_match: details["Fat"] = fat_match.group(1).strip()
            calories_match = re.search(r"- \*\*Calories\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if calories_match: details["Calories"] = calories_match.group(1).strip()

            protein_match = re.search(r"- \*\*Protein\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if protein_match: details["Protein"] = protein_match.group(1).strip()

            carbohydrates_match = re.search(r"- \*\*Carbohydrates\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if carbohydrates_match: details["Carbohydrates"] = carbohydrates_match.group(1).strip()

            fat_match = re.search(r"- \*\*Fat\*\*:\s*([^\n]+)", nutritional_facts_str, re.IGNORECASE)
            if fat_match: details["Fat"] = fat_match.group(1).strip()

            return {
                "food_item": food_item,
                "description": description,
                "details": details
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            logger.error(f"Error invoking LangChain agent or parsing output: {e}")
            return {
                "food_item": food_item,
                "description": f"Failed to generate a comprehensive summary due to an internal error: {e}",
                "details": {}
            }
