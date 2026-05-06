from geopy.geocoders import Nominatim
from geopy.distance import geodesic

#  ADDED (WELCOME PART)
print("Welcome To Our Travel Itinerary Planner")
start_choice = input("Do you want to continue with our travel planner? (yes/no): ").lower()
if start_choice != "yes":
    print("Thank You! Visit Again.")
    exit()

geolocator = Nominatim(user_agent="city_distance_calculator")

overall_total = 0
travel_history = []   #  ADDED

while True:

    city1 = input("Enter Source City: ").lower()
    city2 = input("Enter Destination City: ").lower()

    location1 = geolocator.geocode(city1)
    location2 = geolocator.geocode(city2)

    if location1 and location2:
        coords1 = (location1.latitude, location1.longitude)
        coords2 = (location2.latitude, location2.longitude)

        distance = geodesic(coords1, coords2).kilometers

        print(f"\nDistance between {city1} and {city2} is {round(distance, 2)} KM")

        #  ADDED PASSENGERS
        passengers = int(input("\nEnter number of passengers: "))
        ages = []
        for i in range(passengers):
            age = int(input(f"Enter age of passenger {i+1}: "))
            ages.append(age)

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

            total_passenger_cost = 0

            # ✅ ADDED AGE BASED COST
            for age in ages:
                if age < 10 and (choice == "bus" or choice == "train"):
                    continue
                total_passenger_cost += distance * rate

            cost = total_passenger_cost

            print("\nMode of Travel:", choice)
            print("Cost per KM: rs", mode[choice])
            print("One Way Travel Cost: rs", round(cost, 2))

            travel_cost = cost * 2

            print("Return Travel Cost: rs", round(cost,2))
            print("Total Travel Cost (Going + Returning): rs", round(travel_cost,2))

            travel_history.append((city1, city2, travel_cost))   # ✅ ADDED

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
            "Mall": ["Phoenix Palladium - Lower Parel", "R City Mall - Ghatkopar", "Infiniti Mall - Andheri", "Colaba Causeway"],
            "Parks & Gardens": ["Sanjay Gandhi National Park - Borivali", "Hanging Gardens", "Kamala Nehru Park - Malabar Hill", "Shivaji Park - Dadar"],
            "Picnic Spot": ["Marine Drive", "Chhatrapati Shivaji Maharaj Terminal", "Horniman Circle Garden - Fort", "Juhu Beach"],
            "Religious": ["Siddhivinayak Temple - Prabhadevi", "Mumba Devi Temple - Bhuleshwar", "ISKCON Temple - Juhu", "Mahalaxmi Temple - Mahalaxmi"],
        },

        "chhatrapati sambhajinagar": {
            "Mall": ["Prozone", "Reliance Mall", "Nakshatra Mall", "Shree Mahalaxmi Shopping Mall"],
            "Parks & Gardens": ["Siddharth Garden", "Maharana Pratap Singh Garden", "Smarak Garden", "Chhatrapati Sambhaji Maharaj Park and Garden"],
            "Picnic Spot": ["Ajintha-Verul", "Daulatabad", "Bibi Ka Maqbara"],
            "Religious": ["Bhadramaruti", "Grishneshwar Jyotirlinga", "Shree Omkareshwar Temple", "Kachner Hanuman Temple"],
        },

        "ahilyanagar": {
            "Mall": ["Kohinoor Mall", "Mulchand Mill", "Trends", "Zudio", "Rajpal"],
            "Picnic Spot": ["Kalsubai", "Bhandardara", "Bhuikot Fort", "Chand Bibi Mahal", "Harishchandragad"],
            "Religious": ["Shani Shingnapur", "Shirdi", "Kolhar", "Agadgaon", "Palshi"],
        },

        "pune": {
            "Mall": ["FC Road", "Tulsi Baug", "Phoenix Marketcity - Viman Nagar", "Amanora Mall - Hadapsar", "Seasons Mall - Magarpatta"],
            "Parks & Gardens": ["Saras Baug", "Pu La Deshpande Garden", "Empress Garden", "Rajiv Gandhi Zoological Park"],
            "Picnic Spot": ["Lonavala", "Sinhagad Fort", "Mulshi Dam", "Shivneri Fort"],
            "Religious": ["Dagdu Sheth Ganapati", "Lenyandri", "Jejuri", "Ranjangaon"],
        },

        "nashik": {
            "Mall": ["Nashik City Centre Mall", "Muhurat Shopping Mall", "Ozone Mall", "Star Zone Mall"],
            "Parks & Gardens": ["Pandav Leni Garden", "Godavari Riverfront Garden", "Butterfly Garden - Gangapur Road"],
            "Picnic Spot": ["Pandav Leni", "Gangapur Dam", "Sula Vineyards"],
            "Religious": ["Trimbakeshwar Jyotirlinga", "Kalaram Temple", "Sita Gufa - Panchavati", "Sundarnarayan Temple"],
        }
    }

    #  ADDED ACTIVITIES
    activity_cost = 0
    print("\nDo you want to add activities? (yes/no)")
    if input().lower() == "yes":
        activity_cost = int(input("Enter total activity cost: "))

    #  HOTEL OPTION
    hotel_cost = 0
    print("\nDo you want hotel? (yes/no)")
    if input().lower() == "yes":

        Hotel = {
            "Omsai": {"Room": {"RK": 2000, "1BHK": 3000, "2BHK": 4000}},
            "Smile-Stone": {"Room": {"RK": 2500, "1BHK": 3500, "2BHK": 5000}},
            "7/12": {"Room": {"RK": 1500, "1BHK": 2500, "2BHK": 3500}},
            "Green-Village": {"Room": {"RK": 5000, "1BHK": 7000, "2BHK": 9000}}
        }

        hotels=list(Hotel.keys())
        for i in range(len(hotels)):
            print(i+1,".",hotels[i])

        hotel_choice=int(input("Select hotel: "))
        selected_hotel=hotels[hotel_choice-1]

        rooms=list(Hotel[selected_hotel]["Room"].keys())
        for i in range(len(rooms)):
            print(i+1,".",rooms[i],"₹",Hotel[selected_hotel]["Room"][rooms[i]])

        room_choice=int(input("Select room: "))
        selected_room=rooms[room_choice-1]

        hotel_cost=Hotel[selected_hotel]["Room"][selected_room]

    #  FOOD OPTION
    food_cost = 0
    print("\nDo you want food? (yes/no)")
    if input().lower() == "yes":

        Food = {
            "Maharashtrian":["Puran-Poli: 350", "Dal-Rice: 150", "Veg-Kolhapuri: 400"],
            "Punjabi": ["Chhole-Bhature: 500", "Rajma-Chaval: 300", "Sarson da saag: 350"],
            "Gujarati": ["Jalebi: 50", "Dholka: 100", "Thepla: 150"],
            "Chinese": ["Chilli: 150", "Noodles: 200", "Manchurian: 250"]
        }

        food_types=list(Food.keys())
        for i in range(len(food_types)):
            print(i+1,".",food_types[i])

        food_choice=int(input("Select food type: "))
        selected_food_type=food_types[food_choice-1]

        foods=Food[selected_food_type]
        for i in range(len(foods)):
            print(i+1,".",foods[i])

        food_item_choice=int(input("Select food item: "))
        selected_food=foods[food_item_choice-1]

        price=int(selected_food.split(":")[1].strip())

        plates=int(input("Enter number of plates: "))
        food_cost = price * plates

    # TOTAL
    total_trip_cost=hotel_cost+food_cost+travel_cost+activity_cost

    print("\n----- BILL -----")
    print("Hotel Cost: ₹",hotel_cost)
    print("Food Cost: ₹",food_cost)
    print("Activity Cost: ₹",activity_cost)
    print("Travel Cost: ₹",round(travel_cost,2))
    print("Total Cost: ₹",round(total_trip_cost,2))

    overall_total += total_trip_cost

    another_destination=input("\nDo you want to add another destination? (yes/no): ").lower()
    if another_destination!="yes":
        break

print("\nFinal Total For All Destinations: ₹",round(overall_total,2))
print("Thank You")