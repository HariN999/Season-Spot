import json
import logging
from app.utils.exceptions import InvalidAIResponse

logger = logging.getLogger("app.ai.response_parser")

class ResponseParser:
    @staticmethod
    def parse_json(raw_text: str) -> dict:
        if not raw_text:
            raise InvalidAIResponse("AI response text is empty.")
            
        logger.info("Parsing raw Gemini response text...")
        text = raw_text.strip()
        
        # Robustly locate JSON bounds by scanning for first '{' and last '}'
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        
        if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
            logger.error("No JSON boundaries found in response: " + text)
            raise InvalidAIResponse("Could not locate any valid JSON boundaries in the response.")
            
        json_str = text[start_idx:end_idx + 1]
            
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"JSON syntax parsing failed: {e.msg} at line {e.lineno} col {e.colno} for content: {json_str}")
            raise InvalidAIResponse(f"Failed to parse text as valid JSON: {str(e)}")
