from geopy.geocoders import Nominatim
from geopy.distance import geodesic

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

    # Travel cost per KM
    
    mode = {
        "Bus":2,
        "Train": 0.5,
        "Car":12
    }

    print("\nSelect Mode of Travel:")
    print("Bus (₹2 per KM)")
    print("Train (₹0.5 per KM)")
    print("Car (₹12 per KM)")

    choice = input("Enter your choice: ")

    if choice in mode:
        rate = mode[choice]
        cost = distance * rate
        
        print("\nMode of Travel:", choice)
        print("Cost per KM: ₹", mode[choice])
        print("Total Travel Cost: ₹", round(cost, 2))
    else:
        print("Invalid choice!")
else:
    print("Could not find one or both cities.")


budget = int(input("Enter your budget: "))
if budget < 5000:
    print("Your selection type: Local Trip")
elif budget >=5000 and budget <= 15000:
    print("Your selection type: Domestic Trip")
else:
    print("Your Selection type: Primium Trip")


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


if city2 in Destinations:
    print(f"\n{city2} is available in our destination list.")

    print("\nAvailable Preferences:")
    
    preferences = list(Destinations[city2].keys())
    
    for i in range(len(preferences)):
        print(i+1, ".", preferences[i])

    pref_choice = int(input("Select your preference (Enter number): "))

    if pref_choice >= 1 and pref_choice <= len(preferences):
        selected_pref = preferences[pref_choice - 1]

        print(f"\nPlaces for {selected_pref} in {city2}:")
        
        places = Destinations[city2][selected_pref]
        
        for place in places:
            print("-", place)

    else:
        print("Invalid preference selection.")

else:
    print("\nThe entered city is not in our destination list.")
    print("But I can suggest some other destinations:\n")

    for city in Destinations.keys():
        print("-", city)