import os
from app.repositories.json_repository import JSONStateRepository

# Construct absolute path to backend/app/database/knowledge
KNOWLEDGE_BASE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "database", "knowledge"
)

# Single global instance loaded once at startup
state_repository = JSONStateRepository(KNOWLEDGE_BASE_DIR)

def get_state_repository() -> JSONStateRepository:
    """Dependency injection provider for the state knowledge repository."""
    return state_repository
