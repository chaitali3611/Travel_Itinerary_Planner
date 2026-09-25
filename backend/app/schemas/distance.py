from pydantic import BaseModel, Field, field_validator


class DistanceRequest(BaseModel):
    source_city: str = Field(..., description="Source city name", min_length=2, max_length=100)
    destination_city: str = Field(..., description="Destination city name", min_length=2, max_length=100)

    @field_validator("source_city", "destination_city")
    @classmethod
    def clean_city_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("City name cannot be empty or only whitespace")
        return cleaned


class LocationDetails(BaseModel):
    name: str
    latitude: float
    longitude: float


class DistanceData(BaseModel):
    source: LocationDetails
    destination: LocationDetails
    distance_km: float
