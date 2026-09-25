import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.common import ApiResponse
from app.schemas.distance import DistanceRequest, DistanceData
from app.services.geo_service import geo_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/distance", tags=["Distance & Geocoding"])


@router.post("/calculate", response_model=ApiResponse[DistanceData])
async def calculate_distance(request: DistanceRequest):
    """
    Calculate geodesic distance between source and destination cities.
    Validates locations via Nominatim geocoding and caching.
    """
    try:
        data = geo_service.calculate_distance(
            source_city=request.source_city,
            destination_city=request.destination_city
        )
        return ApiResponse[DistanceData](
            success=True,
            message=f"Distance between {request.source_city} and {request.destination_city} calculated successfully",
            data=data
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error calculating distance: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate distance due to an internal server error"
        )
