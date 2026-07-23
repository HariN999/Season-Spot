# Season-Spot

Season-Spot is an India-focused seasonal travel guide and AI itinerary planner. It helps users decide where to travel in India based on season, weather, cuisine, destination suitability, budget, and travel style.

The project combines a React frontend, a FastAPI backend, a structured JSON knowledge base, and a Gemini-powered itinerary generation pipeline. The core idea is simple: use verified travel knowledge as the source of truth, then use AI only to organize that knowledge into personalized trip plans.

## What Problem It Solves

Most travel websites are destination-first. They tell users about a place, but they do not always answer:

- Which Indian state is best for this season?
- What food is special there right now?
- What kind of traveler is this destination good for?
- How suitable is this state for winter, summer, monsoon, or spring?
- Can I get a personalized itinerary without the AI inventing fake places?

Season-Spot solves this by combining seasonal scoring, regional cuisine, destination highlights, and grounded AI itinerary generation.

## Target Users

- Domestic travelers exploring Indian states
- Food and culture focused travelers
- Budget travelers and students
- Families planning short trips
- Solo travelers and backpackers
- Users who know when they want to travel, but not where to go

## Main Features

- Season-aware destination browsing
- State exploration grid with search and vibe filters
- State detail pages with seasonal weather, food, destinations, and travel tips
- Favorite and recently viewed states using browser local storage
- State comparison API for travel score, budget, accessibility, and transport
- AI itinerary planner powered by Gemini
- JSON knowledge base with startup validation
- AI response parsing, validation, retry, caching, and local fallback
- Health endpoints for service, knowledge base, AI, and cache status

## High-Level Architecture

```text
User
  |
  v
React Frontend
  |-- Pages: Home, Explore, State Detail, Planner
  |-- Components: Navbar, Cards, Chips, Hero, Planner UI
  |-- Hooks: useStates, useStateDetails, usePlanner, useSeasonalData
  |-- API Client: fetch wrapper with timeout and error handling
  |
  v
FastAPI Backend
  |-- Routers: states, search, compare, planner
  |-- Services: TravelService, ItineraryService, Cache
  |-- Repositories: BaseStateRepository, JSONStateRepository
  |-- Models: Pydantic request and response schemas
  |-- AI Layer: PromptBuilder, GeminiProvider, Parser, Validator
  |
  v
JSON Knowledge Base
  |-- metadata.json
  |-- states/*.json
  |
  v
Gemini API
```

## Why This Architecture

The project uses layers so each part has one responsibility:

- The frontend renders the user experience.
- Hooks manage async state and reusable frontend logic.
- API files isolate HTTP calls.
- Routers expose clean backend endpoints.
- Services hold business rules.
- Repositories hide where data comes from.
- Pydantic schemas validate data.
- The AI provider isolates Gemini-specific code.
- The prompt builder keeps prompt construction testable.
- The parser and validator protect the app from malformed AI output.
- The cache avoids repeated AI calls for the same request.

This is better than putting everything in one file because the system is easier to test, debug, extend, and explain.

## Repository Structure

```text
Season-Spot/
  api/
    index.py                         # Vercel Python serverless fallback API
  backend/
    app/
      ai/
        providers/
          base.py                    # AI provider interface
          gemini.py                  # Gemini implementation
        templates/
          itinerary.txt              # Grounded itinerary prompt template
        dependency.py                # AI dependency providers
        itinerary_service.py         # AI itinerary orchestration
        prompt_builder.py            # Prompt construction
        prompt_loader.py             # Prompt file loading
        response_parser.py           # JSON extraction from AI text
        response_validator.py        # Pydantic and day-key validation
      database/
        knowledge/
          metadata.json
          states/*.json              # State travel profiles
      models/
        schemas.py                   # Pydantic models
      repositories/
        base.py                      # Repository contract
        dependency.py                # Repository/service dependency providers
        json_repository.py           # JSON knowledge loader
      routers/
        states.py                    # State and season endpoints
        search.py                    # Search endpoint
        compare.py                   # Comparison endpoint
        planner.py                   # AI planner endpoint
      services/
        cache.py                     # LRU cache with TTL
        travel_service.py            # Core travel business logic
      utils/
        exceptions.py                # Central exception mapping
        logging_config.py            # Logging setup
      config.py                      # Environment settings
      main.py                        # FastAPI application entry
    tests/                           # Backend unit and API tests
    requirements.txt
  frontend/
    src/
      api/                           # HTTP client functions
      components/                    # Shared and home UI components
      context/                       # Season context
      data/                          # Static seasonal data and image URLs
      hooks/                         # Reusable React hooks
      pages/                         # Route-level screens
      App.js                         # Routes and global providers
      theme.js                       # Material UI theme
    package.json
  vercel.json
```

## Frontend Architecture

The frontend is a React application using Material UI, React Router, Framer Motion, and custom hooks.

### Key Pages

- `HomePage`: seasonal landing experience with hero, top destinations, trending states, cuisine highlights, and planner CTA.
- `ExplorePage`: browse all states, search locally, filter by vibe, and open state detail pages.
- `StateDetailPage`: fetches canonical state profile data from the backend and renders seasonal details.
- `PlannerPage`: step-by-step AI itinerary generation flow.

### Key Hooks

- `useSeason`: global selected season from `SeasonContext`.
- `useSeasonalData`: combines static seasonal data with image URLs for fast browsing.
- `useStates`: fetches available states from the backend.
- `useStateDetails`: fetches a complete state profile.
- `usePlanner`: submits AI itinerary requests.
- `useSearch`: calls backend keyword search.
- `useCompare`: calls backend state comparison.
- `useFavorites` and `useRecentlyViewed`: localStorage-backed user state.

### Frontend Data Flow

```text
React Page
  -> Custom Hook
  -> API Function
  -> apiFetch()
  -> Backend Endpoint
  -> JSON Response
  -> Hook State
  -> React Render
```

For Explore browsing, the frontend can work mostly from local static data for speed. For state detail and AI planning, it uses the backend so responses are validated and grounded in the knowledge base.

## Backend Architecture

The backend is a FastAPI application organized around routers, services, repositories, schemas, and dependencies.

### Routers

- `GET /api/states`: list all state names.
- `GET /api/states/{state}`: get a full state profile.
- `GET /api/states/{state}/seasons`: list available seasons for a state.
- `GET /api/states/{state}/seasons/{season}`: get season-specific details.
- `GET /api/search?q=...`: search profiles by state, capital, destination, cuisine, or festival.
- `POST /api/compare`: compare multiple states.
- `POST /api/planner/itinerary`: generate a personalized AI itinerary.

### Services

- `TravelService`: deterministic travel business logic. It retrieves states, seasons, destinations, food, search results, comparisons, and travel scores.
- `ItineraryService`: AI workflow orchestration. It handles cache lookup, knowledge retrieval, prompt building, Gemini call, parsing, validation, retry, and fallback.
- `LRUCacheWithTTL`: in-memory cache for itinerary responses.

### Repository Layer

`JSONStateRepository` loads the JSON knowledge base at startup, validates every state with Pydantic, and stores profiles in memory for fast lookup.

`BaseStateRepository` defines the repository contract. This allows the storage layer to be replaced later without rewriting services.

### Pydantic Models

`schemas.py` defines the application's data contracts:

- `StateData`
- `SeasonData`
- `FoodItem`
- `Destination`
- `Festival`
- `CompareRequest`
- `StateComparisonReport`
- `ItineraryRequest`
- `ItineraryPlan`

Pydantic validation is used for startup validation, request validation, response validation, and AI output validation.

## Knowledge Base Design

The knowledge base lives in:

```text
backend/app/database/knowledge/
  metadata.json
  states/*.json
```

Each state JSON includes:

- Name and capital
- Description and hero image
- Coordinates
- Best and worst months
- Temperature and rainfall by season
- Cuisine, street food, desserts
- Festivals
- Hidden gems and top destinations
- Packing list and travel tips
- Emergency numbers
- Seasonal profiles
- Accessibility and photography spots

JSON is a good fit because the dataset is small, mostly read-only, easy to version in Git, easy to review, and fast to load into memory. A database such as MongoDB or PostgreSQL is not required for the current data shape because there are no complex writes, joins, transactions, or high-volume dynamic records.

## AI Itinerary Pipeline

```text
PlannerPage
  -> usePlanner()
  -> POST /api/planner/itinerary
  -> ItineraryService
  -> Cache lookup
  -> TravelService.get_state()
  -> PromptBuilder
  -> itinerary.txt template
  -> GeminiAIProvider
  -> ResponseParser
  -> ResponseValidator
  -> Cache set
  -> ItineraryPlan response
```

### Why AI Is Grounded

The AI is not allowed to invent destinations or dishes. The prompt passes verified state data to Gemini and instructs it to use only that context. This matters because travel hallucinations can create bad user experiences, unsafe recommendations, or fake attractions.

### Why Parser And Validator Exist

LLMs can return markdown, extra prose, partial JSON, or structurally wrong JSON. The parser extracts the JSON object from raw text. The validator checks that the result matches `ItineraryPlan` and includes the expected day keys such as `day1`, `day2`, and `day3`.

### Why Fallback Exists

If Gemini fails, times out, or returns invalid output twice, `ItineraryService` generates a local deterministic itinerary using known destinations and cuisine from the knowledge base. This keeps the planner useful even when AI is unavailable.

### Why Caching Exists

AI calls are slower and more expensive than normal API calls. The cache stores successful plans by knowledge version, prompt version, model name, state, season, trip type, budget, and duration. Repeating the same request can return instantly.

## Major Request Flows

### Viewing Explore Page

```text
ExplorePage
  -> useSeason()
  -> useSeasonalData(season)
  -> seasonalData.js + stateImages.js
  -> local search/filter
  -> render cards
```

Explore is optimized for speed and does not need to call the backend for every card.

### Viewing A State

```text
Explore card click
  -> /state/:stateName
  -> StateDetailPage
  -> useStateDetails(stateName)
  -> fetchStateDetails()
  -> GET /api/states/{state}
  -> states router
  -> TravelService.get_state()
  -> JSONStateRepository.get_state_by_name()
  -> StateData response
  -> React renders detail page
```

### Searching

```text
Search UI or hook
  -> useSearch()
  -> searchStates(query)
  -> GET /api/search?q=query
  -> search router
  -> TravelService.search_states()
  -> repository profiles
  -> matching StateData[]
```

Search checks state name, capital, description, destinations, cuisines, and festivals.

### Comparing States

```text
Comparison UI
  -> useCompare()
  -> compareStates(stateNames)
  -> POST /api/compare
  -> compare router
  -> CompareRequest validation
  -> TravelService.compare_states()
  -> StateComparisonReport response
```

### Generating An AI Itinerary

```text
PlannerPage
  -> user selects state, season, trip type, budget, duration
  -> usePlanner.generate()
  -> POST /api/planner/itinerary
  -> ItineraryRequest validation
  -> ItineraryService.generate_itinerary()
  -> cache, knowledge, prompt, Gemini, parse, validate, fallback
  -> ItineraryPlan
  -> React renders day cards
```

## Configuration

Backend settings are defined in `backend/app/config.py` using `pydantic-settings`.

Important settings:

- `gemini_api_key`
- `mongo_uri`
- `app_env`
- `port`
- `host`

The `.env` file is expected under `backend/.env`.

## Logging And Errors

Logging is configured in `backend/app/utils/logging_config.py`.

Central exception handling is defined in `backend/app/utils/exceptions.py`. Application-specific exceptions return consistent JSON responses:

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "State 'Atlantis' not found in knowledge base.",
    "details": null
  }
}
```

This gives the frontend predictable error handling.

## Health Endpoints

- `GET /health`: service and cache status.
- `GET /health/knowledge`: knowledge base status and version.
- `GET /health/ai`: Gemini provider health.

The cache health includes hits, misses, hit ratio, evictions, and active keys.

## Testing

Backend tests cover:

- Root and configuration
- Knowledge base loading
- Schema validation failures
- Duplicate food validation
- State and season lookup
- Search
- Comparison
- Prompt loading and rendering
- AI parser and validator
- Itinerary generation success, retry, fallback, and caching
- API endpoints through FastAPI `TestClient`

Tests use mock AI providers so they do not need real Gemini network calls.

## Local Development

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
APP_ENV=development
PORT=5000
HOST=0.0.0.0
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:8000` as the API base URL when running on `localhost` or `127.0.0.1`.

### Build

```bash
cd frontend
npm run build
```

## Deployment

`vercel.json` defines:

- A static frontend build from `frontend/package.json`.
- A Python serverless API entry at `api/index.py`.
- `/api/*` routes to the Python API.
- All other routes serve the frontend.

The main backend implementation is FastAPI under `backend/app/main.py`. The `api/index.py` file is a smaller Flask-based Vercel serverless entry.

## Design Decisions

### Why React

React works well for interactive, stateful travel discovery flows such as filters, stepper-based planning, and dynamic cards.

### Why Material UI

Material UI provides reliable layout, accessible components, responsive primitives, and consistent styling.

### Why FastAPI

FastAPI gives typed request and response models, automatic OpenAPI documentation, dependency injection, and strong Pydantic integration.

### Why Repository Pattern

The repository pattern decouples data access from business logic. Services do not need to know whether data comes from JSON, MongoDB, PostgreSQL, or another source.

### Why Service Layer

The service layer keeps business rules out of route handlers. Routers stay thin, and behavior is easier to test.

### Why Dependency Injection

Dependency injection makes it easy to wire repositories, services, AI providers, prompt builders, and caches. It also makes tests cleaner because dependencies can be overridden.

### Why Pydantic

Pydantic protects the system from malformed input, invalid knowledge files, and incorrect AI responses.

### Why Prompt Templates

Prompt templates keep AI instructions consistent, reviewable, and separate from Python orchestration code.

### Why Gemini Provider Abstraction

The AI provider abstraction allows Gemini to be replaced or mocked without rewriting the itinerary service.

### Why Local Fallback

Fallback ensures the app still returns a usable itinerary when AI fails.

## Current Notes

- The frontend has a fast local seasonal dataset for browsing.
- The backend has a validated JSON knowledge base for canonical profiles and AI grounding.
- The main backend is FastAPI.
- `api/index.py` exists for Vercel serverless deployment compatibility.
- Some image URLs are maintained in `frontend/src/data/stateImages.js` for frontend card and cover rendering.

## Summary

Season-Spot is a full-stack seasonal travel intelligence app for India. It uses React for the user experience, FastAPI for typed APIs, JSON for verified travel knowledge, and Gemini for grounded itinerary generation. The architecture is intentionally layered so the app remains understandable, testable, and extensible as the product grows.
