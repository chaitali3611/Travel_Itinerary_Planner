import logging
from typing import List
from app.core.constants import BUDGET_LOCAL_LIMIT, BUDGET_DOMESTIC_LIMIT
from app.schemas.itinerary import (
    ItinerarySummaryRequest,
    ItinerarySummaryData,
    LegCostSummary,
    LegHotelSummary,
    LegFoodSummary,
    LegFoodItemSummary,
    GrandTotals
)
from app.schemas.travel import TravelCostRequest
from app.services.geo_service import geo_service
from app.services.travel_calculator import travel_calculator
from app.services.catalog_service import catalog_service

logger = logging.getLogger(__name__)


class ItineraryService:
    @staticmethod
    def classify_budget(budget: float) -> str:
        """Exact categorization logic from travel.py"""
        if budget < BUDGET_LOCAL_LIMIT:
            return "Local Trip"
        elif BUDGET_LOCAL_LIMIT <= budget <= BUDGET_DOMESTIC_LIMIT:
            return "Domestic Trip"
        else:
            return "Premium Trip"

    @staticmethod
    def calculate_summary(request: ItinerarySummaryRequest) -> ItinerarySummaryData:
        legs_summary: List[LegCostSummary] = []
        total_travel_cost = 0.0
        total_hotel_cost = 0.0
        total_food_cost = 0.0
        overall_total_cost = 0.0

        for idx, leg in enumerate(request.legs):
            leg_num = leg.leg_index or idx + 1
            src = leg.source_city.strip()
            dest = leg.destination_city.strip()

            # 1. Distance calculation
            dist_data = geo_service.calculate_distance(src, dest)
            distance_km = dist_data.distance_km

            # 2. Travel cost calculation
            travel_req = TravelCostRequest(
                distance_km=distance_km,
                travel_mode=leg.travel_mode,
                passengers=leg.passengers,
                is_round_trip=leg.is_round_trip,
                enable_senior_discount=True
            )
            travel_data = travel_calculator.calculate_cost(travel_req)
            leg_travel_cost = travel_data.total_travel_cost

            # 3. Hotel calculation
            leg_hotel_cost = 0.0
            hotel_summary = None
            if leg.hotel:
                h_name = leg.hotel.hotel_name.strip()
                r_type = leg.hotel.room_type.strip()
                nights = leg.hotel.nights
                unit_price = catalog_service.get_hotel_room_price(h_name, r_type)
                if unit_price is None:
                    # Fallback default if custom
                    unit_price = 2000
                total_h_cost = unit_price * nights
                leg_hotel_cost = float(total_h_cost)
                hotel_summary = LegHotelSummary(
                    hotel=h_name,
                    room_type=r_type,
                    rate_per_night=unit_price,
                    nights=nights,
                    total_cost=total_h_cost
                )

            # 4. Food calculation
            leg_food_cost = 0.0
            food_summary = None
            if leg.food_orders:
                food_items_list: List[LegFoodItemSummary] = []
                total_f_cost = 0
                for order in leg.food_orders:
                    item_name = order.item_name.strip()
                    qty = order.quantity
                    unit_price = catalog_service.get_food_item_price(item_name)
                    if unit_price is None:
                        unit_price = 200  # Fallback default
                    item_total = unit_price * qty
                    total_f_cost += item_total
                    food_items_list.append(
                        LegFoodItemSummary(
                            name=item_name,
                            unit_price=unit_price,
                            quantity=qty,
                            total=item_total
                        )
                    )
                leg_food_cost = float(total_f_cost)
                food_summary = LegFoodSummary(
                    items_count=len(food_items_list),
                    items=food_items_list,
                    total_cost=total_f_cost
                )

            # 5. Single Leg Total (travel + hotel + food)
            leg_total = leg_travel_cost + leg_hotel_cost + leg_food_cost

            total_travel_cost += leg_travel_cost
            total_hotel_cost += leg_hotel_cost
            total_food_cost += leg_food_cost
            overall_total_cost += leg_total

            route_str = f"{src.title()} -> {dest.title()}"
            legs_summary.append(
                LegCostSummary(
                    leg_index=leg_num,
                    route=route_str,
                    source_city=src,
                    destination_city=dest,
                    distance_km=distance_km,
                    travel_cost=round(leg_travel_cost, 2),
                    hotel_cost=round(leg_hotel_cost, 2),
                    food_cost=round(leg_food_cost, 2),
                    leg_total_cost=round(leg_total, 2),
                    travel_details=travel_data,
                    hotel_details=hotel_summary,
                    food_details=food_summary,
                    activities=leg.activities
                )
            )

        budget_cat = ItineraryService.classify_budget(request.budget)
        is_within = (request.budget == 0 or overall_total_cost <= request.budget)
        variance = round(request.budget - overall_total_cost, 2)

        return ItinerarySummaryData(
            trip_name=request.trip_name or "Travel Itinerary",
            budget=round(request.budget, 2),
            budget_category=budget_cat,
            is_within_budget=is_within,
            budget_variance=variance,
            legs_summary=legs_summary,
            grand_totals=GrandTotals(
                total_travel_cost=round(total_travel_cost, 2),
                total_hotel_cost=round(total_hotel_cost, 2),
                total_food_cost=round(total_food_cost, 2),
                overall_total_cost=round(overall_total_cost, 2)
            )
        )


itinerary_service = ItineraryService()
