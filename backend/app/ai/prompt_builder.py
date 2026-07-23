import json
import logging
from app.models.schemas import StateData
from app.ai.prompt_loader import PromptLoader
from app.utils.exceptions import PromptGenerationError

logger = logging.getLogger("app.ai.prompt_builder")

class PromptBuilder:
    def __init__(self, loader: PromptLoader):
        self.loader = loader

    def build_itinerary_prompt(
        self,
        state_data: StateData,
        season_name: str,
        trip_type: str,
        budget: str,
        duration: str
    ) -> str:
        try:
            # 1. Fetch template
            template = self.loader.load_template("itinerary")
            
            # 2. Get season details
            norm_season = season_name.strip().capitalize()
            if norm_season not in state_data.seasons:
                raise PromptGenerationError(f"Season '{season_name}' details missing in state '{state_data.name}' profile.")
            
            season_data = state_data.seasons[norm_season]
            
            # 3. Format structured JSON variables
            locations_json = json.dumps([
                {"name": loc.name, "highlight": loc.highlight, "bestTime": loc.bestTime}
                for loc in (state_data.topDestinations + season_data.locations)
            ])
            food_json = json.dumps([
                {"name": item.name, "desc": item.desc, "tag": item.tag}
                for item in (state_data.cuisine + season_data.food)
            ])
            tips_json = json.dumps(state_data.travelTips + season_data.travelTips)
            packing_json = json.dumps(state_data.packingList)
            
            # Extract number of days from duration (e.g. "3 Days" -> 3)
            try:
                days = int(duration.split()[0])
            except Exception:
                days = 3
                
            json_keys = ", ".join([f'"day{d}": "activities and food spots for day {d}"' for d in range(1, days + 1)])
            
            # 4. Fill template
            prompt = template.format(
                state_name=state_data.name,
                capital=state_data.capital,
                season_name=norm_season,
                vibe=season_data.vibe,
                locations_json=locations_json,
                food_json=food_json,
                tips_json=tips_json,
                packing_json=packing_json,
                trip_type=trip_type,
                budget=budget,
                duration=duration,
                json_keys=json_keys
            )
            return prompt
        except Exception as e:
            if isinstance(e, PromptGenerationError):
                raise e
            raise PromptGenerationError(f"Failed to generate prompt: {str(e)}")
