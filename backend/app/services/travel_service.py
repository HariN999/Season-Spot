import logging
from typing import List, Dict, Optional
from app.repositories.base import BaseStateRepository
from app.models.schemas import StateData, SeasonData, FoodItem, Destination, Festival, StateComparisonReport, StateComparisonItem
from app.utils.exceptions import StateNotFound, SeasonNotFound, ValidationException

logger = logging.getLogger("app.services.travel")

class TravelService:
    def __init__(self, state_repository: BaseStateRepository):
        self.repo = state_repository

    def get_all_states(self) -> List[StateData]:
        """Retrieve all registered Indian state profiles."""
        return self.repo.get_all_states()

    def get_state(self, name: str) -> StateData:
        """Retrieve a specific state profile by name.
        
        Raises StateNotFound if the state is not registered in the database.
        """
        state = self.repo.get_state_by_name(name)
        if not state:
            raise StateNotFound(name)
        return state

    def get_available_seasons(self, state_name: str) -> List[str]:
        """Get list of active season keys for a state."""
        state = self.get_state(state_name)
        return list(state.seasons.keys())

    def get_season(self, state_name: str, season_name: str) -> SeasonData:
        """Get seasonal information details for a specific state.
        
        Raises SeasonNotFound if the requested season does not exist.
        """
        state = self.get_state(state_name)
        # Normalize key lookup (e.g. Winter, Spring, Summer, Monsoon)
        norm_season = season_name.strip().capitalize()
        if norm_season not in state.seasons:
            raise SeasonNotFound(state_name, season_name)
        return state.seasons[norm_season]

    def get_best_months(self, state_name: str) -> List[str]:
        """Get best travel months for a state."""
        state = self.get_state(state_name)
        return state.bestMonths

    def get_worst_months(self, state_name: str) -> List[str]:
        """Get worst travel months for a state."""
        state = self.get_state(state_name)
        return state.worstMonths

    def get_destinations(self, state_name: str, season_name: Optional[str] = None) -> List[Destination]:
        """Get list of must-visit destinations. Merges seasonal recommendations if season is provided."""
        state = self.get_state(state_name)
        destinations = list(state.topDestinations)
        
        if season_name:
            season_data = self.get_season(state_name, season_name)
            # Add unique destinations from the season highlight list
            existing_names = {d.name.lower().strip() for d in destinations}
            for loc in season_data.locations:
                if loc.name.lower().strip() not in existing_names:
                    destinations.append(loc)
        return destinations

    def get_hidden_gems(self, state_name: str) -> List[Destination]:
        """Get listed offbeat hidden gems for a state."""
        state = self.get_state(state_name)
        return state.hiddenGems

    def get_food(self, state_name: str, season_name: Optional[str] = None) -> List[FoodItem]:
        """Get traditional foods list. Merges seasonal specialties if season is provided."""
        state = self.get_state(state_name)
        food_list = list(state.cuisine)
        
        if season_name:
            season_data = self.get_season(state_name, season_name)
            existing_names = {f.name.lower().strip() for f in food_list}
            for item in season_data.food:
                if item.name.lower().strip() not in existing_names:
                    food_list.append(item)
        return food_list

    def get_street_food(self, state_name: str) -> List[FoodItem]:
        """Get street food items for a state."""
        state = self.get_state(state_name)
        return state.streetFood

    def get_festivals(self, state_name: str) -> List[Festival]:
        """Get cultural festivals for a state."""
        state = self.get_state(state_name)
        return state.festivals

    def get_transport(self, state_name: str) -> Dict[str, List[str]]:
        """Get major airports and railways for a state."""
        state = self.get_state(state_name)
        return {
            "airports": state.airports,
            "railwayStations": state.railwayStations
        }

    def get_packing_list(self, state_name: str) -> List[str]:
        """Get essential packing items for a state."""
        state = self.get_state(state_name)
        return state.packingList

    def get_weather(self, state_name: str) -> Dict[str, Dict[str, str]]:
        """Get temperature and rainfall ranges across seasons."""
        state = self.get_state(state_name)
        return {
            "temperature": state.temperature,
            "rainfall": state.rainfall
        }

    def get_travel_tips(self, state_name: str) -> List[str]:
        """Get general travel tips for a state."""
        state = self.get_state(state_name)
        return state.travelTips

    def compare_states(self, state_names: List[str]) -> StateComparisonReport:
        """Compare multiple states side-by-side.
        
        Raises ValidationException if fewer than 2 states are provided.
        """
        if len(state_names) < 2:
            raise ValidationException("Comparison requires at least 2 state names.")
        
        comparison_map = {}
        for name in state_names:
            state = self.get_state(name)
            comparison_map[state.name] = StateComparisonItem(
                name=state.name,
                capital=state.capital,
                travelScore=state.travelScore,
                budgetLevel=state.budgetLevel,
                accessibilityComments=state.accessibility.comments,
                bestMonths=state.bestMonths,
                crowdLevel=state.crowdLevel,
                airportsCount=len(state.airports),
                railwaysCount=len(state.railwayStations)
            )
        return StateComparisonReport(comparison=comparison_map)

    def calculate_travel_score(self, state_name: str, preferences: Dict[str, float]) -> float:
        """Calculate weighted score for a state based on client preferences weights.
        
        preferences keys: e.g. budgetWeight, crowdWeight, scoreWeight
        """
        state = self.get_state(state_name)
        base_score = state.travelScore
        
        # Simple adjustment multiplier logic based on budget preference weight
        budget_weight = preferences.get("budgetWeight", 0.5)
        # Affordable budget levels boost score if weight is high
        if state.budgetLevel.lower() == "affordable":
            base_score += budget_weight * 0.5
        elif state.budgetLevel.lower() == "luxury":
            base_score -= budget_weight * 0.5
            
        return round(max(1.0, min(10.0, base_score)), 2)

    def filter_by_budget(self, states: List[StateData], budget_level: str) -> List[StateData]:
        """Filter list of states by specific budget level (Affordable, Moderate, Luxury)."""
        target = budget_level.lower().strip()
        return [s for s in states if target in s.budgetLevel.lower()]

    def filter_by_season(self, states: List[StateData], season_name: str, min_score: float = 7.5) -> List[StateData]:
        """Filter states where a specific season is highly recommended (suitabilityScore >= min_score)."""
        norm_season = season_name.strip().capitalize()
        filtered = []
        for state in states:
            if norm_season in state.seasons:
                if state.seasons[norm_season].suitabilityScore >= min_score:
                    filtered.append(state)
        return filtered

    def filter_by_travel_style(self, states: List[StateData], style: str) -> List[StateData]:
        """Filter states where seasonal vibe matches travel style keywords (e.g. Beach, Heritage, Adventure)."""
        target = style.lower().strip()
        filtered = []
        for state in states:
            match = False
            for season in state.seasons.values():
                if target in season.vibe.lower():
                    match = True
                    break
            if match:
                filtered.append(state)
        return filtered

    def search_states(self, query: str) -> List[StateData]:
        """Lightweight case-insensitive search across state name, capital, destinations, cuisine, and festivals."""
        term = query.lower().strip()
        if not term:
            return []
            
        results = []
        for state in self.repo.get_all_states():
            # Match state name or capital
            if term in state.name.lower() or term in state.capital.lower() or term in state.description.lower():
                results.append(state)
                continue
                
            # Match destinations (top or hidden)
            dest_match = any(
                term in d.name.lower() or term in d.highlight.lower()
                for d in (state.topDestinations + state.hiddenGems)
            )
            if dest_match:
                results.append(state)
                continue

            # Match traditional, street, or dessert foods
            food_match = any(
                term in f.name.lower() or term in f.desc.lower()
                for f in (state.cuisine + state.streetFood + state.desserts)
            )
            if food_match:
                results.append(state)
                continue

            # Match festivals
            fest_match = any(
                term in fest.name.lower() or term in fest.desc.lower()
                for fest in state.festivals
            )
            if fest_match:
                results.append(state)
                continue

        return results
