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
        cleaned = raw_text.strip()
        
        # Strip markdown json code block fences if present
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
            
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.error(f"JSON syntax parsing failed: {e.msg} at line {e.lineno} col {e.colno}")
            raise InvalidAIResponse(f"Failed to parse text as valid JSON: {str(e)}")
