import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gemini_api_key: str = ""
    mongo_uri: str = ""
    app_env: str = "development"
    port: int = 5000
    host: str = "0.0.0.0"

    # Explicit configuration loader mapping backend/.env relative to this file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
