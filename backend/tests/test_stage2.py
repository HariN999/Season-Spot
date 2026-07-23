import os
import json
import pytest
from app.repositories.dependency import get_state_repository, KNOWLEDGE_BASE_DIR
from app.repositories.json_repository import JSONStateRepository
from app.models.schemas import StateData
from app.utils.exceptions import InvalidKnowledgeSchema, KnowledgeBaseLoadError

def test_valid_knowledge_base_loading():
    repo = JSONStateRepository(KNOWLEDGE_BASE_DIR)
    repo.load_all()
    
    # Verify metadata
    meta = repo.get_metadata()
    assert meta.version is not None
    assert meta.totalStates >= 3

    # Verify states loaded
    states = repo.get_all_states()
    assert len(states) >= 3
    state_names = repo.get_state_names()
    assert "Kerala" in state_names
    assert "Telangana" in state_names
    assert "Andhra Pradesh" in state_names

def test_get_state_by_name():
    repo = JSONStateRepository(KNOWLEDGE_BASE_DIR)
    repo.load_all()
    
    kerala = repo.get_state_by_name("Kerala")
    assert kerala is not None
    assert kerala.capital == "Thiruvananthapuram"
    
    # Case-insensitive checks
    telangana = repo.get_state_by_name("telangana ")
    assert telangana is not None
    assert telangana.capital == "Hyderabad"

    # Missing state checks
    unknown = repo.get_state_by_name("Hyperborea")
    assert unknown is None

def test_dependency_injection_provider():
    repo = get_state_repository()
    assert repo is not None
    assert isinstance(repo, JSONStateRepository)

def test_invalid_json_throws_schema_error(tmp_path):
    # Setup temp structure
    kb_dir = tmp_path / "knowledge"
    kb_dir.mkdir()
    states_dir = kb_dir / "states"
    states_dir.mkdir()

    # Write valid metadata
    with open(kb_dir / "metadata.json", "w") as f:
        json.dump({"version": "1.0", "lastUpdated": "2026-07-23", "totalStates": 1}, f)

    # Write invalid state JSON (missing required capital field)
    invalid_state = {
        "name": "Invalid State",
        "description": "Missing capital field..."
    }
    with open(states_dir / "invalid_state.json", "w") as f:
        json.dump(invalid_state, f)

    repo = JSONStateRepository(str(kb_dir))
    with pytest.raises(InvalidKnowledgeSchema):
        repo.load_all()

def test_duplicate_cuisines_validation_fails(tmp_path):
    # Setup temp structure
    kb_dir = tmp_path / "knowledge"
    kb_dir.mkdir()
    states_dir = kb_dir / "states"
    states_dir.mkdir()

    # Write metadata
    with open(kb_dir / "metadata.json", "w") as f:
        json.dump({"version": "1.0", "lastUpdated": "2026-07-23", "totalStates": 1}, f)

    # Read base valid state to duplicate cuisine in it
    with open(os.path.join(KNOWLEDGE_BASE_DIR, "states", "telangana.json"), "r") as f:
        state_dict = json.load(f)
    
    # Add duplicate cuisine
    state_dict["cuisine"].append(state_dict["cuisine"][0])

    with open(states_dir / "dup_cuisine.json", "w") as f:
        json.dump(state_dict, f)

    repo = JSONStateRepository(str(kb_dir))
    with pytest.raises(InvalidKnowledgeSchema) as excinfo:
        repo.load_all()
    assert "Duplicate food item detected" in str(excinfo.value)
