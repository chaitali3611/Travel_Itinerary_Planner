from typing import List
from app.core.constants import (
    TRAVEL_MODE_RATES,
    CHILD_FREE_TRAVEL_MODES,
    CHILD_FREE_AGE_LIMIT,
    SENIOR_CITIZEN_AGE_THRESHOLD,
    SENIOR_DISCOUNT_PERCENTAGE,
    SENIOR_DISCOUNT_MODES
)
from app.schemas.travel import (
    Passenger,
    PassengerFareBreakdown,
    TravelCostRequest,
    TravelCostData
)


class TravelCalculatorService:
    @staticmethod
    def calculate_cost(request: TravelCostRequest) -> TravelCostData:
        mode = request.travel_mode.lower()
        if mode not in TRAVEL_MODE_RATES:
            raise ValueError(f"Invalid travel mode: '{request.travel_mode}'")

        rate = TRAVEL_MODE_RATES[mode]
        distance = request.distance_km
        base_cost_per_person = distance * rate

        passenger_breakdowns: List[PassengerFareBreakdown] = []
        paying_passengers_count = 0
        free_passengers_count = 0
        one_way_total = 0.0

        for idx, p in enumerate(request.passengers):
            p_id = p.id if p.id is not None else idx + 1
            p_name = p.name or f"Passenger {idx + 1}"
            age = p.age

            # 1. Child rule: in bus/train, age < 10 travels free
            if mode in CHILD_FREE_TRAVEL_MODES and age < CHILD_FREE_AGE_LIMIT:
                status = "FREE_CHILD"
                discount_pct = 100.0
                one_way_fare = 0.0
                free_passengers_count += 1
            # 2. Senior citizen discount: in bus/train, age >= 60 gets discount
            elif (
                request.enable_senior_discount
                and mode in SENIOR_DISCOUNT_MODES
                and age >= SENIOR_CITIZEN_AGE_THRESHOLD
            ):
                status = "SENIOR_DISCOUNT"
                discount_pct = SENIOR_DISCOUNT_PERCENTAGE
                discount_factor = 1.0 - (SENIOR_DISCOUNT_PERCENTAGE / 100.0)
                one_way_fare = base_cost_per_person * discount_factor
                paying_passengers_count += 1
            else:
                status = "REGULAR"
                discount_pct = 0.0
                one_way_fare = base_cost_per_person
                paying_passengers_count += 1

            return_fare = one_way_fare if request.is_round_trip else 0.0
            total_fare = one_way_fare * 2 if request.is_round_trip else one_way_fare
            one_way_total += one_way_fare

            passenger_breakdowns.append(
                PassengerFareBreakdown(
                    id=p_id,
                    name=p_name,
                    age=age,
                    status=status,
                    discount_percentage=discount_pct,
                    one_way_fare=round(one_way_fare, 2),
                    return_fare=round(return_fare, 2),
                    total_fare=round(total_fare, 2)
                )
            )

        return_total = one_way_total if request.is_round_trip else 0.0
        total_travel_cost = one_way_total * 2 if request.is_round_trip else one_way_total

        return TravelCostData(
            travel_mode=mode,
            rate_per_km=rate,
            distance_km=round(distance, 2),
            base_fare_per_person=round(base_cost_per_person, 2),
            total_passengers=len(request.passengers),
            paying_passengers_count=paying_passengers_count,
            free_passengers_count=free_passengers_count,
            passenger_breakdown=passenger_breakdowns,
            one_way_cost=round(one_way_total, 2),
            return_cost=round(return_total, 2),
            total_travel_cost=round(total_travel_cost, 2)
        )


travel_calculator = TravelCalculatorService()
