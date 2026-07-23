import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logging_config import setup_logging
from app.utils.exceptions import register_exception_handlers

import contextlib

# Initialize logging configuration before doing anything else
setup_logging()
logger = logging.getLogger("app.main")

from app.repositories.dependency import state_repository, get_state_repository
from app.ai.dependency import get_ai_provider
from app.ai.providers.base import BaseAIProvider
from app.repositories.json_repository import JSONStateRepository
from app.routers import states, search, compare, planner
from fastapi import Depends

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Season Spot FastAPI backend starting up in environment: {settings.app_env}")
    # Load and validate the entire deterministic knowledge base
    state_repository.load_all()
    logger.info("Knowledge base successfully validated and loaded on startup.")
    yield
    logger.info("Season Spot FastAPI backend shutting down.")

app = FastAPI(
    title="Season-Spot API",
    description="Intelligent Travel & Culinary Seasonal Engine for India",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://season-spot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register central error mapping handlers
register_exception_handlers(app)

# Register REST Routers
app.include_router(states.router)
app.include_router(search.router)
app.include_router(compare.router)
app.include_router(planner.router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Season-Spot FastAPI Backend Running!"}

from app.ai.dependency import get_itinerary_cache
from app.services.cache import LRUCacheWithTTL

@app.get("/health", tags=["System Health Status"])
async def health_check(cache: LRUCacheWithTTL = Depends(get_itinerary_cache)):
    """Retrieve overall system operational status and in-memory cache statistics."""
    return {
        "status": "healthy",
        "service": "Season-Spot Backend",
        "cache": {
            "hits": cache.hits,
            "misses": cache.misses,
            "hit_ratio": cache.hit_ratio,
            "evictions": cache.evictions,
            "active_keys": len(cache.cache)
        }
    }

@app.get("/health/knowledge", tags=["System Health Status"])
async def knowledge_health(repo: JSONStateRepository = Depends(get_state_repository)):
    """Retrieve internal deterministic knowledge database state status."""
    total_states = len(repo.get_state_names())
    status = "healthy" if total_states >= 3 else "degraded"
    return {
        "status": status,
        "total_states": total_states,
        "knowledge_version": repo.get_metadata().version
    }

@app.get("/health/ai", tags=["System Health Status"])
async def ai_health(ai_provider: BaseAIProvider = Depends(get_ai_provider)):
    """Check connection connectivity state to the configured Google Gemini API."""
    ok = ai_provider.health_check()
    status = "healthy" if ok else "unhealthy"
    return {
        "status": status,
        "provider": "Google Gemini"
    }
