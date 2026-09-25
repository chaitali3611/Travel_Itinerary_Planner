"""
Static catalogs preserving the exact data from original travel.py
"""
from typing import Dict, List, Any

DESTINATIONS_CATALOG: Dict[str, Dict[str, List[str]]] = {
    "mumbai": {
        "Mall": [
            "Phoenix Palladium - Lower Parel",
            "R City Mall - Ghatkopar",
            "Infiniti Mall - Andheri",
            "Colaba Causeway"
        ],
        "Parks & Gardens": [
            "Sanjay Gandhi National Park - Borivali",
            "Hanging Gardens",
            "Kamala Nehru Park - Malabar Hill",
            "Shivaji Park - Dadar"
        ],
        "Picnic Spot": [
            "Marine Drive",
            "Chhatrapati Shivaji Maharaj Terminal",
            "Horniman Circle Garden - Fort",
            "Juhu Beach"
        ],
        "Religious": [
            "Siddhivinayak Temple - Prabhadevi",
            "Mumba Devi Temple - Bhuleshwar",
            "ISKCON Temple - Juhu",
            "Mahalaxmi Temple - Mahalaxmi"
        ]
    },
    "chhatrapati sambhajinagar": {
        "Mall": [
            "Prozone",
            "Reliance Mall",
            "Nakshatra Mall",
            "Shree Mahalaxmi Shopping Mall"
        ],
        "Parks & Gardens": [
            "Siddharth Garden",
            "Maharana Pratap Singh Garden",
            "Smarak Garden",
            "Chhatrapati Sambhaji Maharaj Park and Garden"
        ],
        "Picnic Spot": [
            "Ajintha-Verul",
            "Daulatabad",
            "Bibi Ka Maqbara"
        ],
        "Religious": [
            "Bhadramaruti",
            "Grishneshwar Jyotirlinga",
            "Shree Omkareshwar Temple",
            "Kachner Hanuman Temple"
        ]
    },
    "ahilyanagar": {
        "Mall": [
            "Kohinoor Mall",
            "Mulchand Mill",
            "Trends",
            "Zudio",
            "Rajpal"
        ],
        "Picnic Spot": [
            "Kalsubai",
            "Bhandardara",
            "Bhuikot Fort",
            "Chand Bibi Mahal",
            "Harishchandragad"
        ],
        "Religious": [
            "Shani Shingnapur",
            "Shirdi",
            "Kolhar",
            "Agadgaon",
            "Palshi"
        ]
    },
    "pune": {
        "Mall": [
            "FC Road",
            "Tulsi Baug",
            "Phoenix Marketcity - Viman Nagar",
            "Amanora Mall - Hadapsar",
            "Seasons Mall - Magarpatta"
        ],
        "Parks & Gardens": [
            "Saras Baug",
            "Pu La Deshpande Garden",
            "Empress Garden",
            "Rajiv Gandhi Zoological Park"
        ],
        "Picnic Spot": [
            "Lonavala",
            "Sinhagad Fort",
            "Mulshi Dam",
            "Shivneri Fort"
        ],
        "Religious": [
            "Dagdu Sheth Ganapati",
            "Lenyandri",
            "Jejuri",
            "Ranjangaon"
        ]
    },
    "nashik": {
        "Mall": [
            "Nashik City Centre Mall",
            "Muhurat Shopping Mall",
            "Ozone Mall",
            "Star Zone Mall"
        ],
        "Parks & Gardens": [
            "Pandav Leni Garden",
            "Godavari Riverfront Garden",
            "Butterfly Garden - Gangapur Road"
        ],
        "Picnic Spot": [
            "Pandav Leni",
            "Gangapur Dam",
            "Sula Vineyards"
        ],
        "Religious": [
            "Trimbakeshwar Jyotirlinga",
            "Kalaram Temple",
            "Sita Gufa - Panchavati",
            "Sundarnarayan Temple"
        ]
    }
}

HOTELS_CATALOG: Dict[str, Dict[str, Dict[str, int]]] = {
    "Omsai": {
        "Room": {"RK": 2000, "1BHK": 3000, "2BHK": 4000}
    },
    "Smile-Stone": {
        "Room": {"RK": 2500, "1BHK": 3500, "2BHK": 5000}
    },
    "7/12": {
        "Room": {"RK": 1500, "1BHK": 2500, "2BHK": 3500}
    },
    "Green-Village": {
        "Room": {"RK": 5000, "1BHK": 7000, "2BHK": 9000}
    }
}

FOOD_RAW_CATALOG: Dict[str, List[str]] = {
    "Maharashtrian": ["Puran-Poli: 350", "Dal-Rice: 150", "Veg-Kolhapuri: 400"],
    "Punjabi": ["Chhole-Bhature: 500", "Rajma-Chaval: 300", "Sarson da saag: 350"],
    "Gujarati": ["Jalebi: 50", "Dholka: 100", "Thepla: 150"],
    "Chinese": ["Chilli: 150", "Noodles: 200", "Manchurian: 250"]
}

# Structured food catalog for easy API responses
def get_structured_food_catalog() -> Dict[str, List[Dict[str, Any]]]:
    structured = {}
    for cuisine, items in FOOD_RAW_CATALOG.items():
        structured[cuisine] = []
        for raw_item in items:
            parts = raw_item.split(":")
            name = parts[0].strip()
            price = int(parts[1].strip())
            structured[cuisine].append({"name": name, "price": price, "raw_string": raw_item})
    return structured
