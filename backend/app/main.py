import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logging_config import setup_logging
from app.utils.exceptions import register_exception_handlers

# Initialize logging configuration before doing anything else
setup_logging()
logger = logging.getLogger("app.main")

app = FastAPI(
    title="Season-Spot API",
    description="Intelligent Travel & Culinary Seasonal Engine for India",
    version="2.0.0"
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

from app.repositories.dependency import state_repository

@app.on_event("startup")
async def startup_event():
    logger.info(f"Season Spot FastAPI backend starting up in environment: {settings.app_env}")
    # Load and validate the entire deterministic knowledge base
    state_repository.load_all()
    logger.info("Knowledge base successfully validated and loaded on startup.")

@app.get("/")
async def root():
    return {"status": "ok", "message": "Season-Spot FastAPI Backend Running!"}
