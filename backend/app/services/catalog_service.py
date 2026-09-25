from typing import Dict, List, Optional
from app.core.data_catalogs import (
    DESTINATIONS_CATALOG,
    HOTELS_CATALOG,
    get_structured_food_catalog
)
from app.schemas.catalog import (
    DestinationsCatalogData,
    HotelsCatalogData,
    HotelRoomOption,
    FoodCatalogData,
    FoodItem
)


class CatalogService:
    @staticmethod
    def get_destinations(city: Optional[str] = None) -> DestinationsCatalogData:
        cities = list(DESTINATIONS_CATALOG.keys())
        if city:
            city_key = city.strip().lower()
            if city_key in DESTINATIONS_CATALOG:
                return DestinationsCatalogData(
                    cities=[city_key],
                    catalogs={city_key: DESTINATIONS_CATALOG[city_key]}
                )
            else:
                return DestinationsCatalogData(cities=cities, catalogs={})
        return DestinationsCatalogData(
            cities=cities,
            catalogs=DESTINATIONS_CATALOG
        )

    @staticmethod
    def get_hotels() -> HotelsCatalogData:
        hotel_list = []
        for name, data in HOTELS_CATALOG.items():
            hotel_list.append(
                HotelRoomOption(
                    name=name,
                    rooms=data["Room"]
                )
            )
        return HotelsCatalogData(hotels=hotel_list)

    @staticmethod
    def get_food() -> FoodCatalogData:
        structured_raw = get_structured_food_catalog()
        cuisines_data: Dict[str, List[FoodItem]] = {}
        for cuisine, items in structured_raw.items():
            cuisines_data[cuisine] = [
                FoodItem(name=i["name"], price=i["price"], raw_string=i["raw_string"])
                for i in items
            ]
        return FoodCatalogData(cuisines=cuisines_data)

    @staticmethod
    def get_hotel_room_price(hotel_name: str, room_type: str) -> Optional[int]:
        # Case-insensitive lookup for hotel and room type
        for h_name, h_data in HOTELS_CATALOG.items():
            if h_name.lower() == hotel_name.strip().lower():
                for r_type, price in h_data["Room"].items():
                    if r_type.lower() == room_type.strip().lower():
                        return price
        return None

    @staticmethod
    def get_food_item_price(item_name: str) -> Optional[int]:
        clean_target = item_name.strip().lower()
        food_dict = get_structured_food_catalog()
        for cuisine, items in food_dict.items():
            for item in items:
                if item["name"].lower() == clean_target:
                    return item["price"]
        return None


catalog_service = CatalogService()
