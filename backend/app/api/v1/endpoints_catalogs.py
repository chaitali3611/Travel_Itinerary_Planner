from typing import Optional, Dict
from fastapi import APIRouter, Query
from app.schemas.common import ApiResponse
from app.schemas.catalog import DestinationsCatalogData, HotelsCatalogData, FoodCatalogData
from app.services.catalog_service import catalog_service
from app.core.constants import (
    TRAVEL_MODE_RATES,
    CHILD_FREE_TRAVEL_MODES,
    CHILD_FREE_AGE_LIMIT,
    SENIOR_CITIZEN_AGE_THRESHOLD,
    SENIOR_DISCOUNT_PERCENTAGE,
    SENIOR_DISCOUNT_MODES
)

router = APIRouter(prefix="/catalogs", tags=["Data Catalogs"])


@router.get("/destinations", response_model=ApiResponse[DestinationsCatalogData])
async def get_destinations_catalog(city: Optional[str] = Query(None, description="Filter by city name")):
    """
    Get all supported destination cities and categorized activities
    (Mall, Parks & Gardens, Picnic Spot, Religious).
    """
    data = catalog_service.get_destinations(city=city)
    return ApiResponse[DestinationsCatalogData](
        success=True,
        message="Destinations catalog retrieved successfully",
        data=data
    )


@router.get("/hotels", response_model=ApiResponse[HotelsCatalogData])
async def get_hotels_catalog():
    """
    Get all hotels and room prices (RK, 1BHK, 2BHK).
    """
    data = catalog_service.get_hotels()
    return ApiResponse[HotelsCatalogData](
        success=True,
        message="Hotels catalog retrieved successfully",
        data=data
    )


@router.get("/food", response_model=ApiResponse[FoodCatalogData])
async def get_food_catalog():
    """
    Get all food categories (Maharashtrian, Punjabi, Gujarati, Chinese) and dishes with prices.
    """
    data = catalog_service.get_food()
    return ApiResponse[FoodCatalogData](
        success=True,
        message="Food catalog retrieved successfully",
        data=data
    )


@router.get("/travel-modes", response_model=ApiResponse[Dict])
async def get_travel_modes_catalog():
    """
    Get all travel modes, rates per KM, child rules, and discount rules.
    """
    data = {
        "rates_per_km": TRAVEL_MODE_RATES,
        "child_free_rules": {
            "eligible_modes": CHILD_FREE_TRAVEL_MODES,
            "max_free_age": CHILD_FREE_AGE_LIMIT - 1
        },
        "senior_discount_rules": {
            "eligible_modes": SENIOR_DISCOUNT_MODES,
            "min_age": SENIOR_CITIZEN_AGE_THRESHOLD,
            "discount_percentage": SENIOR_DISCOUNT_PERCENTAGE
        }
    }
    return ApiResponse[Dict](
        success=True,
        message="Travel modes catalog retrieved successfully",
        data=data
    )
