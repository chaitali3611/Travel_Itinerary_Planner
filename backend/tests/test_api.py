import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


def test_destinations_catalog():
    response = client.get("/api/v1/catalogs/destinations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    cities = data["data"]["cities"]
    assert "mumbai" in cities
    assert "pune" in cities
    assert "nashik" in cities
    assert "chhatrapati sambhajinagar" in cities
    assert "ahilyanagar" in cities
    # Check categories for Pune
    pune_cats = data["data"]["catalogs"]["pune"]
    assert "Mall" in pune_cats
    assert "Picnic Spot" in pune_cats


def test_hotels_catalog():
    response = client.get("/api/v1/catalogs/hotels")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    hotels = {h["name"]: h["rooms"] for h in data["data"]["hotels"]}
    assert "Omsai" in hotels
    assert "Smile-Stone" in hotels
    assert "7/12" in hotels
    assert "Green-Village" in hotels
    assert hotels["Smile-Stone"]["1BHK"] == 3500


def test_food_catalog():
    response = client.get("/api/v1/catalogs/food")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    cuisines = data["data"]["cuisines"]
    assert "Maharashtrian" in cuisines
    assert "Punjabi" in cuisines
    assert "Gujarati" in cuisines
    assert "Chinese" in cuisines
    # Check Maharashtrian items
    m_items = {item["name"]: item["price"] for item in cuisines["Maharashtrian"]}
    assert m_items["Puran-Poli"] == 350
    assert m_items["Dal-Rice"] == 150


def test_distance_calculation():
    payload = {
        "source_city": "Mumbai",
        "destination_city": "Pune"
    }
    response = client.post("/api/v1/distance/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["distance_km"] > 0
    assert "latitude" in data["data"]["source"]
    assert "longitude" in data["data"]["destination"]


def test_travel_cost_bus_child_rule():
    # Distance = 100 KM, Mode = Bus (rate 2.0)
    # Passengers: 1 Adult (30), 1 Child (8)
    # Child is FREE on Bus. Only adult pays: 100 * 2.0 = 200. Round trip = 400.
    payload = {
        "distance_km": 100.0,
        "travel_mode": "bus",
        "is_round_trip": True,
        "passengers": [
            {"name": "Adult", "age": 30},
            {"name": "Child", "age": 8}
        ]
    }
    response = client.post("/api/v1/travel/calculate-cost", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert res["paying_passengers_count"] == 1
    assert res["free_passengers_count"] == 1
    assert res["rate_per_km"] == 2.0
    assert res["one_way_cost"] == 200.0
    assert res["total_travel_cost"] == 400.0


def test_travel_cost_flight_all_pay():
    # Flight rate = 30.0 / KM. All passengers pay regardless of age.
    # Distance = 100 KM, 2 passengers (age 8, age 30)
    # Fare per person = 3000. One way = 6000. Round trip = 12000.
    payload = {
        "distance_km": 100.0,
        "travel_mode": "flight",
        "is_round_trip": True,
        "passengers": [
            {"name": "Adult", "age": 30},
            {"name": "Child", "age": 8}
        ]
    }
    response = client.post("/api/v1/travel/calculate-cost", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert res["paying_passengers_count"] == 2
    assert res["free_passengers_count"] == 0
    assert res["total_travel_cost"] == 12000.0


def test_travel_cost_train_senior_discount():
    # Train rate = 0.5 / KM. Senior citizen gets 25% discount on train.
    # Distance = 200 KM. Base fare = 100.
    # Senior fare = 75 one-way, 150 round trip.
    payload = {
        "distance_km": 200.0,
        "travel_mode": "train",
        "is_round_trip": True,
        "enable_senior_discount": True,
        "passengers": [
            {"name": "Senior", "age": 65}
        ]
    }
    response = client.post("/api/v1/travel/calculate-cost", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert res["passenger_breakdown"][0]["status"] == "SENIOR_DISCOUNT"
    assert res["passenger_breakdown"][0]["discount_percentage"] == 25.0
    assert res["total_travel_cost"] == 150.0


def test_itinerary_multi_destination_calculation():
    # Test multi-leg itinerary with 2 destinations:
    # Leg 1: Mumbai -> Pune, Bus, Hotel Smile-Stone 1BHK (3500) 1 night, 2 Puran-Poli (700)
    # Leg 2: Pune -> Nashik, Train, Hotel Omsai RK (2000) 1 night, 1 Chhole-Bhature (500)
    payload = {
        "trip_name": "Maharashtra Multi-City Tour",
        "budget": 20000,
        "legs": [
            {
                "leg_index": 1,
                "source_city": "Mumbai",
                "destination_city": "Pune",
                "travel_mode": "bus",
                "is_round_trip": True,
                "passengers": [{"name": "User", "age": 25}],
                "activities": [{"category": "Picnic Spot", "place": "Lonavala"}],
                "hotel": {"hotel_name": "Smile-Stone", "room_type": "1BHK", "nights": 1},
                "food_orders": [{"item_name": "Puran-Poli", "quantity": 2}]
            },
            {
                "leg_index": 2,
                "source_city": "Pune",
                "destination_city": "Nashik",
                "travel_mode": "train",
                "is_round_trip": False,
                "passengers": [{"name": "User", "age": 25}],
                "activities": [{"category": "Religious", "place": "Trimbakeshwar Jyotirlinga"}],
                "hotel": {"hotel_name": "Omsai", "room_type": "RK", "nights": 1},
                "food_orders": [{"item_name": "Chhole-Bhature", "quantity": 1}]
            }
        ]
    }
    response = client.post("/api/v1/itinerary/calculate-summary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert len(res["legs_summary"]) == 2
    assert res["budget_category"] == "Premium Trip"
    assert res["grand_totals"]["overall_total_cost"] > 0
    assert res["grand_totals"]["total_hotel_cost"] == 3500 + 2000
    assert res["grand_totals"]["total_food_cost"] == 700 + 500


def test_invalid_travel_mode_validation():
    payload = {
        "distance_km": 100.0,
        "travel_mode": "submarine",  # Invalid mode
        "passengers": [{"age": 25}]
    }
    response = client.post("/api/v1/travel/calculate-cost", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
