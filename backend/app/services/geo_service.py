import logging
from typing import Dict, Tuple, Optional
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from app.core.config import settings
from app.schemas.distance import LocationDetails, DistanceData

logger = logging.getLogger(__name__)

# Fallback coordinates for primary Maharashtra cities in catalog
KNOWN_CITY_FALLBACKS: Dict[str, Tuple[float, float, str]] = {
    "mumbai": (19.0760, 72.8777, "Mumbai, Maharashtra, India"),
    "pune": (18.5204, 73.8567, "Pune, Maharashtra, India"),
    "chhatrapati sambhajinagar": (19.8762, 75.3433, "Chhatrapati Sambhajinagar, Maharashtra, India"),
    "sambhajinagar": (19.8762, 75.3433, "Chhatrapati Sambhajinagar, Maharashtra, India"),
    "aurangabad": (19.8762, 75.3433, "Chhatrapati Sambhajinagar, Maharashtra, India"),
    "ahilyanagar": (19.0952, 74.7496, "Ahilyanagar, Maharashtra, India"),
    "ahmednagar": (19.0952, 74.7496, "Ahilyanagar, Maharashtra, India"),
    "nashik": (19.9975, 73.7898, "Nashik, Maharashtra, India"),
    "delhi": (28.6139, 77.2090, "New Delhi, Delhi, India"),
    "bangalore": (12.9716, 77.5946, "Bengaluru, Karnataka, India"),
    "bengaluru": (12.9716, 77.5946, "Bengaluru, Karnataka, India"),
    "hyderabad": (17.3850, 78.4867, "Hyderabad, Telangana, India"),
    "chennai": (13.0827, 80.2707, "Chennai, Tamil Nadu, India"),
    "kolkata": (22.5726, 88.3639, "Kolkata, West Bengal, India"),
    "goa": (15.2993, 74.1240, "Goa, India"),
    "jaipur": (26.9124, 75.7873, "Jaipur, Rajasthan, India")
}


class GeoService:
    def __init__(self):
        self._geolocator: Optional[Nominatim] = None
        self._cache: Dict[str, LocationDetails] = {}

    @property
    def geolocator(self) -> Nominatim:
        if self._geolocator is None:
            self._geolocator = Nominatim(
                user_agent=settings.GEO_USER_AGENT,
                timeout=settings.GEO_TIMEOUT_SECONDS
            )
        return self._geolocator

    def geocode_city(self, city_name: str) -> Optional[LocationDetails]:
        """
        Geocode a city name into coordinates and formatted display name.
        Uses in-memory cache and fallbacks for high reliability.
        """
        key = city_name.strip().lower()
        if key in self._cache:
            return self._cache[key]

        # Check offline fallbacks first for instant response
        if key in KNOWN_CITY_FALLBACKS:
            lat, lon, display = KNOWN_CITY_FALLBACKS[key]
            loc = LocationDetails(name=display, latitude=lat, longitude=lon)
            self._cache[key] = loc
            return loc

        # Query Nominatim
        try:
            location = self.geolocator.geocode(city_name)
            if location:
                loc = LocationDetails(
                    name=location.address,
                    latitude=location.latitude,
                    longitude=location.longitude
                )
                self._cache[key] = loc
                return loc
        except Exception as e:
            logger.warning(f"Nominatim geocoding failed for '{city_name}': {e}")
            # If query failed but matches a known partial key
            for fallback_key, (lat, lon, display) in KNOWN_CITY_FALLBACKS.items():
                if fallback_key in key or key in fallback_key:
                    loc = LocationDetails(name=display, latitude=lat, longitude=lon)
                    self._cache[key] = loc
                    return loc

        return None

    def calculate_distance(self, source_city: str, destination_city: str) -> DistanceData:
        """
        Calculate geodesic distance in kilometers between source and destination cities.
        Exact logic from travel.py: geodesic(coords1, coords2).kilometers
        """
        loc1 = self.geocode_city(source_city)
        if not loc1:
            raise ValueError(f"Could not find or geocode source city: '{source_city}'")

        loc2 = self.geocode_city(destination_city)
        if not loc2:
            raise ValueError(f"Could not find or geocode destination city: '{destination_city}'")

        coords1 = (loc1.latitude, loc1.longitude)
        coords2 = (loc2.latitude, loc2.longitude)

        dist = geodesic(coords1, coords2).kilometers
        dist_rounded = round(dist, 2)

        return DistanceData(
            source=loc1,
            destination=loc2,
            distance_km=dist_rounded
        )


geo_service = GeoService()
