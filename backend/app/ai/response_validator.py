import logging
from typing import Type
from pydantic import BaseModel, ValidationError
from app.utils.exceptions import InvalidAIResponse

logger = logging.getLogger("app.ai.response_validator")

class ResponseValidator:
    @staticmethod
    def validate_response(data: dict, model_cls: Type[BaseModel], expected_days: int) -> BaseModel:
        logger.info(f"Validating parsed AI data against schema model {model_cls.__name__}")
        
        # 1. Validate structure using Pydantic
        try:
            validated = model_cls(**data)
        except ValidationError as e:
            logger.error(f"Pydantic schema validation error: {e.errors()}")
            raise InvalidAIResponse("Gemini response did not conform to the expected output model schema.", details=str(e))

        # 2. Check if all required day keys are present (e.g., 'day1', 'day2', etc.)
        plan_dict = getattr(validated, "plan", {}) or {}
        for day in range(1, expected_days + 1):
            day_key = f"day{day}"
            if day_key not in plan_dict:
                raise InvalidAIResponse(f"Validation failed: Itinerary plan is missing required key '{day_key}'.")
                
        return validated
