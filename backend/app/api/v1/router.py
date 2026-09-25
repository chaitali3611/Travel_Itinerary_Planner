from fastapi import APIRouter
from app.api.v1 import (
    endpoints_distance,
    endpoints_travel,
    endpoints_catalogs,
    endpoints_itinerary
)

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(endpoints_distance.router)
api_v1_router.include_router(endpoints_travel.router)
api_v1_router.include_router(endpoints_catalogs.router)
api_v1_router.include_router(endpoints_itinerary.router)
