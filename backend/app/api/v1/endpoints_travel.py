import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.common import ApiResponse
from app.schemas.travel import TravelCostRequest, TravelCostData
from app.services.travel_calculator import travel_calculator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/travel", tags=["Travel Modes & Cost"])


@router.post("/calculate-cost", response_model=ApiResponse[TravelCostData])
async def calculate_travel_cost(request: TravelCostRequest):
    """
    Calculate transportation cost based on distance, travel mode, passenger count,
    age rules (free travel for children < 10 on bus/train, senior citizen discounts).
    """
    try:
        data = travel_calculator.calculate_cost(request)
        return ApiResponse[TravelCostData](
            success=True,
            message=f"Travel cost for {request.travel_mode.title()} calculated successfully",
            data=data
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error calculating travel cost: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate travel cost"
        )
