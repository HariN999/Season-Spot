import os
import logging
from app.utils.exceptions import PromptTemplateNotFound

logger = logging.getLogger("app.ai.prompt_loader")

class PromptLoader:
    def __init__(self):
        self.templates_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "templates"
        )

    def load_template(self, name: str) -> str:
        filename = f"{name}.txt"
        file_path = os.path.join(self.templates_dir, filename)
        
        if not os.path.exists(file_path):
            raise PromptTemplateNotFound(f"Prompt template file '{filename}' was not found in directory: {self.templates_dir}")
            
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise PromptTemplateNotFound(f"Failed to read prompt template '{filename}': {str(e)}")
