from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Optional

class Coordinates(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate", example=17.3850)
    longitude: float = Field(..., description="Longitude coordinate", example=78.4867)

class FoodItem(BaseModel):
    name: str = Field(..., description="Name of the food item", example="Hyderabadi Biryani")
    desc: str = Field(..., description="Short appetizing description", example="A savory rice dish layered with spiced marinated meat.")
    tag: str = Field(..., description="Classification category", example="Traditional")

class Destination(BaseModel):
    name: str = Field(..., description="Name of the destination", example="Charminar")
    highlight: str = Field(..., description="What makes it special in this season", example="Stunning monument built in 1591.")
    bestTime: str = Field(..., description="Best time of day to visit", example="Evening")

class Festival(BaseModel):
    name: str = Field(..., description="Festival name", example="Bathukamma")
    desc: str = Field(..., description="Short explanation of celebrations")
    month: str = Field(..., description="Month when it is celebrated")

class Accessibility(BaseModel):
    wheelchairAccess: bool = Field(..., description="Is the state majorly wheelchair accessible?")
    comments: str = Field(..., description="Remarks on accessibility constraints")

class SeasonData(BaseModel):
    vibe: str = Field(..., description="Seasonal vibe", example="Heritage & Nature")
    suitabilityScore: float = Field(..., description="Score out of 10", ge=1.0, le=10.0)
    tempRange: str = Field(..., description="Average temperatures during this season")
    weatherDesc: str = Field(..., description="Description of the weather conditions")
    food: List[FoodItem] = Field(..., description="Seasonal dishes")
    locations: List[Destination] = Field(..., description="Sights to visit")
    travelTips: List[str] = Field(..., description="Insider tips")

class StateData(BaseModel):
    name: str = Field(..., description="Indian State name")
    capital: str = Field(..., description="State capital city")
    description: str = Field(..., description="High-impact overview description")
    heroImage: str = Field(..., description="Main landscape photograph URL")
    gallery: List[str] = Field(..., description="URLs for the photography grid")
    coordinates: Coordinates
    bestMonths: List[str] = Field(..., description="Best travel months")
    worstMonths: List[str] = Field(..., description="Months to avoid")
    temperature: Dict[str, str] = Field(..., description="Average temp per season")
    rainfall: Dict[str, str] = Field(..., description="Average rainfall level per season")
    crowdLevel: str = Field(..., description="Average tourism density status")
    travelScore: float = Field(..., description="Overall state suitability rating", ge=1.0, le=10.0)
    budgetLevel: str = Field(..., description="Typical traveler budget index status")
    tripDuration: str = Field(..., description="Suggested trip length")
    airports: List[str] = Field(..., description="Major nearby airports")
    railwayStations: List[str] = Field(..., description="Major nearby railway stations")
    nearbyStates: List[str] = Field(..., description="Bordering states names")
    languages: List[str] = Field(..., description="Officially spoken regional languages")
    cuisine: List[FoodItem] = Field(..., description="Traditional dining items")
    streetFood: List[FoodItem] = Field(..., description="Famous local street items")
    desserts: List[FoodItem] = Field(..., description="Famous dessert delicacies")
    festivals: List[Festival] = Field(..., description="Major cultural celebrations")
    hiddenGems: List[Destination] = Field(..., description="Under-explored places")
    topDestinations: List[Destination] = Field(..., description="Must-see tourist centers")
    packingList: List[str] = Field(..., description="Packing items recommendations")
    travelTips: List[str] = Field(..., description="Insider general safety tips")
    emergencyNumbers: Dict[str, str] = Field(..., description="Helpful direct hotline links")
    seasons: Dict[str, SeasonData] = Field(..., description="Full seasons dictionary")
    weatherWarnings: List[str] = Field(..., description="Potential severe seasonal conditions")
    accessibility: Accessibility
    photographySpots: List[str] = Field(..., description="Highly recommended photography points")

    @field_validator("cuisine", "streetFood", "desserts")
    @classmethod
    def validate_no_duplicate_foods(cls, v: List[FoodItem]) -> List[FoodItem]:
        seen = set()
        for item in v:
            name_lower = item.name.lower().strip()
            if name_lower in seen:
                raise ValueError(f"Duplicate food item detected: {item.name}")
            seen.add(name_lower)
        return v

    @field_validator("topDestinations", "hiddenGems")
    @classmethod
    def validate_no_duplicate_destinations(cls, v: List[Destination]) -> List[Destination]:
        seen = set()
        for item in v:
            name_lower = item.name.lower().strip()
            if name_lower in seen:
                raise ValueError(f"Duplicate destination detected: {item.name}")
            seen.add(name_lower)
        return v

    @field_validator("seasons")
    @classmethod
    def validate_all_seasons_present(cls, v: Dict[str, SeasonData]) -> Dict[str, SeasonData]:
        required = {"Winter", "Spring", "Summer", "Monsoon"}
        missing = required - set(v.keys())
        if missing:
            raise ValueError(f"Missing required seasonal profiles: {missing}")
        return v

class KnowledgeMetadata(BaseModel):
    version: str = Field(..., description="Knowledge base version")
    lastUpdated: str = Field(..., description="ISO update timestamp")
    totalStates: int = Field(..., description="Total active states in registry")

class StateComparisonItem(BaseModel):
    name: str = Field(..., description="Name of the state")
    capital: str = Field(..., description="Capital city")
    travelScore: float = Field(..., description="Calculated travel score rating")
    budgetLevel: str = Field(..., description="Calculated budget level category index")
    accessibilityComments: str = Field(..., description="State accessibility notes")
    bestMonths: List[str] = Field(..., description="Best months of the year to visit")
    crowdLevel: str = Field(..., description="Average tourist density indicators")
    airportsCount: int = Field(..., description="Number of nearby major airports available")
    railwaysCount: int = Field(..., description="Number of nearby major railway stations available")

class StateComparisonReport(BaseModel):
    comparison: Dict[str, StateComparisonItem] = Field(..., description="States comparisons map keyed by state name")

class ItineraryRequest(BaseModel):
    state: str = Field(..., min_length=2)
    season: str = Field(..., pattern="^(Winter|Spring|Summer|Monsoon)$")
    tripType: str
    budget: str
    duration: str = Field(..., pattern="^(3|5|7) Days$")

class ItineraryPlan(BaseModel):
    plan: Dict[str, str] = Field(..., description="Day-by-day itinerary keyed by day1, day2, etc.")

class CompareRequest(BaseModel):
    states: List[str] = Field(..., min_length=2, max_length=5, description="List of state names to compare", example=["Kerala", "Telangana"])
