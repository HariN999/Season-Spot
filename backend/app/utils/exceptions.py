from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger("app.exceptions")

class AppException(Exception):
    def __init__(self, status_code: int, message: str, details: str = None):
        self.status_code = status_code
        self.message = message
        self.details = details
        super().__init__(message)

class ResourceNotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: str = None):
        super().__init__(404, message, details)

class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed", details: str = None):
        super().__init__(422, message, details)

class AIPlatformException(AppException):
    def __init__(self, message: str = "AI Model reasoning failed", details: str = None):
        super().__init__(502, message, details)

class KnowledgeBaseLoadError(AppException):
    def __init__(self, message: str = "Knowledge base failed to load", details: str = None):
        super().__init__(500, message, details)

class InvalidKnowledgeSchema(AppException):
    def __init__(self, message: str = "Knowledge schema validation failed", details: str = None):
        super().__init__(500, message, details)

class StateNotFound(ResourceNotFoundException):
    def __init__(self, state_name: str):
        super().__init__(f"State '{state_name}' not found in knowledge base.")

class SeasonNotFound(ResourceNotFoundException):
    def __init__(self, state_name: str, season_name: str):
        super().__init__(f"Season '{season_name}' not found for state '{state_name}'.")

class AIProviderError(AppException):
    def __init__(self, message: str = "AI Provider error occurred", details: str = None):
        super().__init__(502, message, details)

class PromptGenerationError(AppException):
    def __init__(self, message: str = "Prompt generation failed", details: str = None):
        super().__init__(500, message, details)

class InvalidAIResponse(AppException):
    def __init__(self, message: str = "Invalid AI response structure", details: str = None):
        super().__init__(502, message, details)

class PromptTemplateNotFound(AppException):
    def __init__(self, message: str = "Prompt template file missing", details: str = None):
        super().__init__(500, message, details)

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        logger.error(f"Application error: {exc.message} - {exc.details or ''}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "status": "error",
                "error": {
                    "code": exc.status_code,
                    "message": exc.message,
                    "details": exc.details
                }
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Request validation failure: {exc.errors()}")
        return JSONResponse(
            status_code=422,
            content={
                "status": "error",
                "error": {
                    "code": 422,
                    "message": "Validation Error",
                    "details": exc.errors()
                }
            }
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception("An unexpected server error occurred.")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": {
                    "code": 500,
                    "message": "Internal Server Error",
                    "details": "An unexpected error occurred. Please try again later."
                }
            }
        )
