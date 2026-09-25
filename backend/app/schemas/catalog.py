from typing import Dict, List
from pydantic import BaseModel


class DestinationsCatalogData(BaseModel):
    cities: List[str]
    catalogs: Dict[str, Dict[str, List[str]]]


class HotelRoomOption(BaseModel):
    name: str
    rooms: Dict[str, int]


class HotelsCatalogData(BaseModel):
    hotels: List[HotelRoomOption]


class FoodItem(BaseModel):
    name: str
    price: int
    raw_string: str


class FoodCatalogData(BaseModel):
    cuisines: Dict[str, List[FoodItem]]
