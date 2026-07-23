import logging
import time
import google.generativeai as genai
from app.ai.providers.base import BaseAIProvider
from app.config import settings
from app.utils.exceptions import AIProviderError

logger = logging.getLogger("app.ai.providers.gemini")

class GeminiAIProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.model_name = "gemini-1.5-flash"
        
        if not self.api_key:
            raise AIProviderError("Gemini API key is not configured in settings.")
            
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            logger.info("Gemini provider successfully configured.")
        except Exception as e:
            raise AIProviderError(f"Failed to configure Gemini client: {str(e)}")

    def generate(self, prompt: str) -> str:
        logger.info(f"Sending request to Gemini model: {self.model_name}")
        start_time = time.time()
        
        # Retry once on transient failures
        last_exception = None
        for attempt in range(1, 3):
            try:
                response = self.model.generate_content(prompt)
                latency = time.time() - start_time
                logger.info(f"Gemini generation completed in {latency:.2f}s (attempt {attempt})")
                return response.text
            except Exception as e:
                last_exception = e
                logger.warning(f"Gemini API request failed on attempt {attempt}: {str(e)}")
                if attempt < 2:
                    time.sleep(1)
                    
        raise AIProviderError(f"Gemini model generate call failed after retry attempts.", details=str(last_exception))

    def health_check(self) -> bool:
        try:
            # Send a simple validation ping to verify key state
            self.model.generate_content("ping")
            return True
        except Exception:
            return False
