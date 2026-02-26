from geopy.geocoders import Nominatim
from geopy.distance import geodesic

Dict = {"Railway": 0.5,
        "Bus": 2,
        "Car": 12}

geolocator = Nominatim(user_agent="city_distance_calculator")

city1 = input("Enter Source City: ")
city2 = input("Enter Destination City: ")

location1 = geolocator.geocode(city1)
location2 = geolocator.geocode(city2)

if location1 and location2:
    coords1 = (location1.latitude, location1.longitude)
    coords2 = (location2.latitude, location2.longitude)

    distance = geodesic(coords1, coords2).kilometers

    print(f"\nDistance between {city1} and {city2} is {round(distance, 2)} KM")

    print("\nSelect Mode of Travel:")
    print("1. Bus (₹2 per KM)")
    print("2. Train (₹0.5 per KM)")
    print("3. Car (₹12 per KM)")

    choice = int(input("Enter your choice (1-3): "))

    if choice == 1:
        cost = distance * 2
        mode = "Bus"
    elif choice == 2:
        cost = distance * 0.5
        mode = "Train"
    elif choice == 3:
        cost = distance * 12
        mode = "Car"
    else:
        print("Invalid choice!")
        cost = None

    if cost is not None:
        print("\nMode of Travel:", mode)
        print("Total Travel Cost: ₹", round(cost, 2))

else:
    print("Could not find one or both cities.")