from geopy.geocoders import Nominatim
from geopy.distance import geodesic

geolocator = Nominatim(user_agent="city_distance_calculator")

city1 = input("Enter Source City: ").lower()
city2 = input("Enter Destination City: ").lower()

location1 = geolocator.geocode(city1)
location2 = geolocator.geocode(city2)

if location1 and location2:
    coords1 = (location1.latitude, location1.longitude)
    coords2 = (location2.latitude, location2.longitude)

    distance = geodesic(coords1, coords2).kilometers

    print(f"\nDistance between {city1} and {city2} is {round(distance, 2)} KM")
    
    mode = {
        "bus":2,
        "train": 0.5,
        "self-car":10,
        "flight":30,
        "rent-car":15
    }

    print("\nSelect Mode of Travel:")
    print("Bus (₹2 per KM)")
    print("Train (₹0.5 per KM)")
    print("Self-Car (₹10 per KM)")
    print("Flight(30 per KM)")
    print("Rent-Car(15 per KM)")

    choice = input("Enter your choice: ").lower()

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
    print("Your Selection type: Premium Trip")

Destinations = {
    "mumbai": {
        "Shopping": ["Phoenix Palladium - Lower Parel", "R City Mall - Ghatkopar", "Infiniti Mall - Andheri", "Colaba Causeway"],
        "Parks & Gardens": ["Sanjay Gandhi National Park - Borivali", "Hanging Gardens", "Kamala Nehru Park - Malabar Hill", "Shivaji Park - Dadar"],
        "Picnic Spot": ["Marine Drive", "Chhatrapati Shivaji Maharaj Terminal", "Horniman Circle Garden - Fort", "Juhu Beach"],
        "Religious": ["Siddhivinayak Temple - Prabhadevi", "Mumba Devi Temple - Bhuleshwar", "ISKCON Temple - Juhu", "Mahalaxmi Temple - Mahalaxmi"],
    },

    "chhatrapati sambhajinagar": {
        "Shopping": ["Prozone", "Reliance Mall", "Nakshatra Mall", "Shree Mahalaxmi Shopping Mall"],
        "Parks & Gardens": ["Siddharth Garden", "Maharana Pratap Singh Garden", "Smarak Garden", "Chhatrapati Sambhaji Maharaj Park and Garden"],
        "Picnic Spot": ["Ajintha-Verul", "Daulatabad", "Bibi Ka Maqbara"],
        "Religious": ["Bhadramaruti", "Grishneshwar Jyotirlinga", "Shree Omkareshwar Temple", "Kachner Hanuman Temple"],
    },

    "ahilyanagar": {
        "Shopping": ["Kohinoor Mall", "Mulchand Mill", "Trends", "Zudio", "Rajpal"],
        "Picnic Spot": ["Kalsubai", "Bhandardara", "Bhuikot Fort", "Chand Bibi Mahal", "Harishchandragad"],
        "Religious": ["Shani Shingnapur", "Shirdi", "Kolhar", "Agadgaon", "Palshi"],
    },

    "pune": {
        "Shopping": ["FC Road", "Tulsi Baug", "Phoenix Marketcity - Viman Nagar", "Amanora Mall - Hadapsar", "Seasons Mall - Magarpatta"],
        "Parks & Gardens": ["Saras Baug", "Pu La Deshpande Garden", "Empress Garden", "Rajiv Gandhi Zoological Park"],
        "Picnic Spot": ["Lonavala", "Sinhagad Fort", "Mulshi Dam", "Shivneri Fort"],
        "Religious": ["Dagdu Sheth Ganapati", "Lenyandri", "Jejuri", "Ranjangaon"],
    },

    "nashik": {
        "Shopping": ["Nashik City Centre Mall", "Muhurat Shopping Mall", "Ozone Mall", "Star Zone Mall"],
        "Parks & Gardens": ["Pandav Leni Garden", "Godavari Riverfront Garden", "Butterfly Garden - Gangapur Road"],
        "Picnic Spot": ["Pandav Leni", "Gangapur Dam", "Sula Vineyards"],
        "Religious": ["Trimbakeshwar Jyotirlinga", "Kalaram Temple", "Sita Gufa - Panchavati", "Sundarnarayan Temple"],
    }
}

# Preference Selection
if city2 in Destinations:
    print(f"\n{city2} is available in our destination list.")

    preferences = list(Destinations[city2].keys())

    print("\nAvailable Preferences:")
    for i in range(len(preferences)):
        print(i+1, ".", preferences[i])

    pref_choice = int(input("Select your preference (Enter number): "))

    if pref_choice >= 1 and pref_choice <= len(preferences):
        selected_pref = preferences[pref_choice - 1]

        print(f"\nPlaces for {selected_pref} in {city2}:")
        
        places = Destinations[city2][selected_pref]
        
        for place in places:
            print("-", place)

        # -------------------------------
        # 🔹 ITINERARY SECTION (ADDED)
        # -------------------------------

        activities = []
        accommodations = []
        activity_costs = []
        accommodation_costs = []

        print("\nEnter your plan details:")

        for place in places:
            print(f"\nFor place: {place}")
            
            act = input("Enter activity: ")
            activities.append(act)

            acc = input("Enter accommodation: ")
            accommodations.append(acc)

            a_cost = float(input("Enter activity cost: "))
            activity_costs.append(a_cost)

            ac_cost = float(input("Enter accommodation cost: "))
            accommodation_costs.append(ac_cost)

        # Total Cost Calculation
        total_cost = 0

        if location1 and location2 and choice in mode:
            total_cost += total_cost

        for i in range(len(places)):
            total_cost += activity_costs[i]
            total_cost += accommodation_costs[i]

        # Final Output
        print("\n------ FINAL TRAVEL ITINERARY ------")

        print("\nDestination:", city2)
        print("Mode of Travel:", choice)

        for i in range(len(places)):
            print("\nPlace:", places[i])
            print("Activity:", activities[i])
            print("Accommodation:", accommodations[i])
            print("Activity Cost:", activity_costs[i])
            print("Accommodation Cost:", accommodation_costs[i])

        print("\nTotal Trip Cost: ₹", round(total_cost, 2))

    else:
        print("Invalid preference selection.")

else:
    print("\nThe entered city is not in our destination list.")
    print("Suggested cities:")
    for city in Destinations.keys():
        print("-", city)