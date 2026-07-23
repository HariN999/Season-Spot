import os
import json
import logging
from typing import List, Dict, Optional
from app.repositories.base import BaseStateRepository
from app.models.schemas import StateData, KnowledgeMetadata
from app.utils.exceptions import KnowledgeBaseLoadError, InvalidKnowledgeSchema

logger = logging.getLogger("app.repositories.json")

class JSONStateRepository(BaseStateRepository):
    def __init__(self, base_path: str):
        self.base_path = base_path
        self._states: Dict[str, StateData] = {}
        self._metadata: Optional[KnowledgeMetadata] = None

    def load_all(self) -> None:
        """Loads and validates all state files and metadata from the disk."""
        logger.info(f"Loading knowledge base from path: {self.base_path}")
        
        # 1. Load and validate metadata.json
        metadata_file = os.path.join(self.base_path, "metadata.json")
        if not os.path.exists(metadata_file):
            raise KnowledgeBaseLoadError(f"Metadata file '{metadata_file}' is missing from knowledge base.")
        
        try:
            with open(metadata_file, "r", encoding="utf-8") as f:
                raw_meta = json.load(f)
            self._metadata = KnowledgeMetadata(**raw_meta)
        except Exception as e:
            raise InvalidKnowledgeSchema(f"Metadata schema validation failed: {str(e)}")

        # 2. Load and validate individual state profile files
        states_dir = os.path.join(self.base_path, "states")
        if not os.path.isdir(states_dir):
            raise KnowledgeBaseLoadError(f"States folder '{states_dir}' is missing from knowledge base.")
        
        state_files = [f for f in os.listdir(states_dir) if f.endswith(".json")]
        if not state_files:
            raise KnowledgeBaseLoadError(f"No state JSON files found in '{states_dir}'.")
        
        loaded_states = {}
        for filename in state_files:
            file_path = os.path.join(states_dir, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    raw_data = json.load(f)
                state_data = StateData(**raw_data)
                
                # Deduplicate state entry key lookup (store lower case)
                loaded_states[state_data.name.lower().strip()] = state_data
                logger.info(f"Successfully loaded and validated state: {state_data.name}")
            except Exception as e:
                # startup must fail if any state file fails schema check
                raise InvalidKnowledgeSchema(f"State file '{filename}' schema check failed: {str(e)}")

        self._states = loaded_states
        logger.info(f"Successfully loaded {len(self._states)} states in repository.")

    def get_metadata(self) -> KnowledgeMetadata:
        if not self._metadata:
            raise KnowledgeBaseLoadError("Repository metadata has not been loaded.")
        return self._metadata

    def get_all_states(self) -> List[StateData]:
        return list(self._states.values())

    def get_state_names(self) -> List[str]:
        return [state.name for state in self._states.values()]

    def get_state_by_name(self, name: str) -> Optional[StateData]:
        key = name.lower().strip()
        return self._states.get(key)
