from typing import List, Optional, Union
from pydantic import BaseModel, Field, field_validator
from app.core.constants import TRAVEL_MODE_RATES


class Passenger(BaseModel):
    id: Optional[Union[int, str]] = None
    name: Optional[str] = "Passenger"
    age: int = Field(default=18, ge=0, le=120, description="Passenger age in years")


class PassengerFareBreakdown(BaseModel):
    id: Optional[Union[int, str]] = None
    name: Optional[str] = "Passenger"
    age: int
    status: str  # "FREE_CHILD", "REGULAR", "SENIOR_DISCOUNT"
    discount_percentage: float = 0.0
    one_way_fare: float
    return_fare: float
    total_fare: float


class TravelCostRequest(BaseModel):
    distance_km: float = Field(..., ge=0, description="Distance in kilometers")
    travel_mode: str = Field(..., description="Travel mode: bus, train, self-car, flight, rent-car")
    passengers: List[Passenger] = Field(default_factory=lambda: [Passenger(age=18)], min_length=1)
    is_round_trip: bool = Field(default=True, description="Whether the calculation is for a round trip (2x)")
    enable_senior_discount: bool = Field(default=True, description="Apply senior discount on eligible modes")

    @field_validator("travel_mode")
    @classmethod
    def validate_travel_mode(cls, v: str) -> str:
        mode_clean = v.strip().lower()
        if mode_clean not in TRAVEL_MODE_RATES:
            valid_modes = ", ".join(TRAVEL_MODE_RATES.keys())
            raise ValueError(f"Invalid travel mode '{v}'. Must be one of: {valid_modes}")
        return mode_clean


class TravelCostData(BaseModel):
    travel_mode: str
    rate_per_km: float
    distance_km: float
    base_fare_per_person: float
    total_passengers: int
    paying_passengers_count: int
    free_passengers_count: int
    passenger_breakdown: List[PassengerFareBreakdown]
    one_way_cost: float
    return_cost: float
    total_travel_cost: float
