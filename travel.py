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


budget = int(input("Enter your budget: "))
if budget < 5000:
    print("Your selection type: Local Trip")
elif budget >=5000 and budget <= 15000:
    print("Your selection type: Domestic Trip")
else:
    print("Your Selection type: Primium Trip")
    
print("Select Your Prefference")

Destinations = {
    "Mumbai": {
        "Shopping": ["Phoenix Palladium - Lower Parel", "R City Mall - Ghatkopar", "Infiniti Mall - Andheri", "Colaba Causeway"],
        "Parks & Gardens": ["Sanjay Gandhi National Park - Borivali", "Hanging Gardens", "Kamala Nehru Park - Malabar Hill", "Shivaji Park - Dadar"],
        "Picnic Spot": ["Marine Drive", "Chhatrapati Shivaji Maharaj Terminal", "Horniman Circle Garden - Fort", "Juhu Beach"],
        "Religious": ["Siddhivinayak Temple - Prabhadevi", "Mumba Devi Temple - Bhuleshwar", "ISKCON Temple - Juhu", "Mahalaxmi Temple - Mahalaxmi"],
    },

    "Chhatrapati Sambhajinagar": {
        "Shopping": ["Prozone", "Reliance Mall", "Nakshatra Mall", "Shree Mahalaxmi Shopping Mall"],
        "Parks & Gardens": ["Siddharth Garden", "Maharana Pratap Singh Garden", "Smarak Garden", "Chhatrapati Sambhaji Maharaj Park and Garden"],
        "Picnic Spot": ["Ajintha-Verul", "Daulatabad", "Bibi Ka Maqbara"],
        "Religious": ["Bhadramaruti", "Grishneshwar Jyotirlinga", "Shree Omkareshwar Temple", "Kachner Hanuman Temple"],
    },

    "Ahilyanagar": {
        "Shopping": ["Kohinoor Mall", "Mulchand Mill", "Trends", "Zudio", "Rajpal"],
        "Picnic Spot": ["Kalsubai", "Bhandardara", "Bhuikot Fort", "Chand Bibi Mahal", "Harishchandragad"],
        "Religious": ["Shani Shingnapur", "Shirdi", "Kolhar", "Agadgaon", "Palshi"],
    },

    "Pune": {
        "Shopping": ["FC Road", "Tulsi Baug", "Phoenix Marketcity - Viman Nagar", "Amanora Mall - Hadapsar", "Seasons Mall - Magarpatta"],
        "Parks & Gardens": ["Saras Baug", "Pu La Deshpande Garden", "Empress Garden", "Rajiv Gandhi Zoological Park"],
        "Picnic Spot": ["Lonavala", "Sinhagad Fort", "Mulshi Dam", "Shivneri Fort"],
        "Religious": ["Dagdu Sheth Ganapati", "Lenyandri", "Jejuri", "Ranjangaon"],
    },

    "Nashik": {
        "Shopping": ["Nashik City Centre Mall", "Muhurat Shopping Mall", "Ozone Mall", "Star Zone Mall"],
        "Parks & Gardens": ["Pandav Leni Garden", "Godavari Riverfront Garden", "Butterfly Garden - Gangapur Road"],
        "Picnic Spot": ["Pandav Leni", "Gangapur Dam", "Sula Vineyards"],
        "Religious": ["Trimbakeshwar Jyotirlinga", "Kalaram Temple", "Sita Gufa - Panchavati", "Sundarnarayan Temple"],
    }
}