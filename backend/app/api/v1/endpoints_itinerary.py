import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.common import ApiResponse
from app.schemas.itinerary import ItinerarySummaryRequest, ItinerarySummaryData
from app.services.itinerary_service import itinerary_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/itinerary", tags=["Itinerary & Bill Calculation"])


@router.post("/calculate-summary", response_model=ApiResponse[ItinerarySummaryData])
async def calculate_itinerary_summary(request: ItinerarySummaryRequest):
    """
    Calculate consolidated multi-destination itinerary summary, individual leg expenses,
    budget classification (Local, Domestic, Premium), and grand totals.
    """
    try:
        data = itinerary_service.calculate_summary(request)
        return ApiResponse[ItinerarySummaryData](
            success=True,
            message="Itinerary summary and bill calculated successfully",
            data=data
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error calculating itinerary summary: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate itinerary summary"
        )
