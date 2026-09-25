"""
Constants and business rule configurations for Travel Itinerary Planner
Preserves exact rates and rules from original project
"""

# Travel mode rates per kilometer in INR (₹)
TRAVEL_MODE_RATES = {
    "bus": 2.0,
    "train": 0.5,
    "self-car": 10.0,
    "flight": 30.0,
    "rent-car": 15.0
}

# Travel modes where children travel free under certain age
CHILD_FREE_TRAVEL_MODES = ["bus", "train"]
CHILD_FREE_AGE_LIMIT = 10  # Age < 10 travels free

# Senior Citizen Discount configuration
SENIOR_CITIZEN_AGE_THRESHOLD = 60
SENIOR_DISCOUNT_PERCENTAGE = 25.0  # 25% discount for senior citizens on public transport (bus/train)
SENIOR_DISCOUNT_MODES = ["bus", "train"]

# Budget classification thresholds (INR ₹)
BUDGET_LOCAL_LIMIT = 5000
BUDGET_DOMESTIC_LIMIT = 15000
