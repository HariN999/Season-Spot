from abc import ABC, abstractmethod

class BaseAIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Send prompt to AI model, returning the raw text string response.
        
        Must raise AIProviderError on failure.
        """
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """Check connection state to remote AI API endpoints."""
        pass
