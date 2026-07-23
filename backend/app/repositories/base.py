from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.schemas import StateData, KnowledgeMetadata

class BaseStateRepository(ABC):
    @abstractmethod
    def load_all(self) -> None:
        """Load and validate all state profiles in the knowledge base."""
        pass

    @abstractmethod
    def get_metadata(self) -> KnowledgeMetadata:
        """Get knowledge base metadata."""
        pass

    @abstractmethod
    def get_all_states(self) -> List[StateData]:
        """Retrieve all loaded states."""
        pass

    @abstractmethod
    def get_state_names(self) -> List[str]:
        """Retrieve names of all loaded states."""
        pass

    @abstractmethod
    def get_state_by_name(self, name: str) -> Optional[StateData]:
        """Retrieve state by its case-insensitive name."""
        pass
