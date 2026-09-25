from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.travel import Passenger, TravelCostData


class ActivitySelection(BaseModel):
    category: str
    place: str


class HotelSelection(BaseModel):
    hotel_name: str
    room_type: str
    nights: int = Field(default=1, ge=1, description="Number of nights for stay")


class FoodOrderItem(BaseModel):
    cuisine: Optional[str] = None
    item_name: str
    quantity: int = Field(default=1, ge=1, description="Number of plates / meals")


class ItineraryLegRequest(BaseModel):
    leg_index: Optional[int] = 1
    source_city: str
    destination_city: str
    travel_mode: str = "bus"
    is_round_trip: bool = True
    passengers: List[Passenger] = Field(default_factory=lambda: [Passenger(age=18)], min_length=1)
    activities: List[ActivitySelection] = Field(default_factory=list)
    hotel: Optional[HotelSelection] = None
    food_orders: List[FoodOrderItem] = Field(default_factory=list)


class ItinerarySummaryRequest(BaseModel):
    trip_name: Optional[str] = "My Travel Itinerary"
    budget: float = Field(default=0.0, ge=0.0, description="Total user trip budget")
    legs: List[ItineraryLegRequest] = Field(..., min_length=1)


class LegFoodItemSummary(BaseModel):
    name: str
    unit_price: int
    quantity: int
    total: int


class LegHotelSummary(BaseModel):
    hotel: str
    room_type: str
    rate_per_night: int
    nights: int
    total_cost: int


class LegFoodSummary(BaseModel):
    items_count: int
    items: List[LegFoodItemSummary]
    total_cost: int


class LegCostSummary(BaseModel):
    leg_index: int
    route: str
    source_city: str
    destination_city: str
    distance_km: float
    travel_cost: float
    hotel_cost: float
    food_cost: float
    leg_total_cost: float
    travel_details: TravelCostData
    hotel_details: Optional[LegHotelSummary] = None
    food_details: Optional[LegFoodSummary] = None
    activities: List[ActivitySelection] = Field(default_factory=list)


class GrandTotals(BaseModel):
    total_travel_cost: float
    total_hotel_cost: float
    total_food_cost: float
    overall_total_cost: float


class ItinerarySummaryData(BaseModel):
    trip_name: str
    budget: float
    budget_category: str
    is_within_budget: bool
    budget_variance: float
    legs_summary: List[LegCostSummary]
    grand_totals: GrandTotals
