from geopy.geocoders import Nominatim
from geopy.distance import geodesic


# -------- Welcome Function --------
def welcome():
    print(" Welcome To Our Travel Itinerary Planner ")


def start_planner():

    geolocator = Nominatim(user_agent="city_distance_calculator")
    overall_total = 0

    while True:

        city1 = input("\nEnter Source City: ").lower()
        city2 = input("Enter Destination City: ").lower()

        location1 = geolocator.geocode(city1)
        location2 = geolocator.geocode(city2)

        if location1 and location2:
            coords1 = (location1.latitude, location1.longitude)
            coords2 = (location2.latitude, location2.longitude)

            distance = geodesic(coords1, coords2).kilometers
            print(f"\nDistance between {city1} and {city2} is {round(distance, 2)} KM")

            mode = {
                "bus": 2,
                "train": 0.5,
                "self-car": 10,
                "flight": 30,
                "rent-car": 15
            }

            print("\nSelect Mode of Travel:")
            for m in mode:
                print(f"{m.title()} (₹{mode[m]} per KM)")

            choice = input("Enter your choice: ").lower()

            if choice in mode:
                rate = mode[choice]
                cost = distance * rate

                print("\nMode of Travel:", choice)
                print("Cost per KM: ₹", rate)
                print("One Way Travel Cost: ₹", round(cost, 2))

                travel_cost = cost * 2

                print("Return Travel Cost: ₹", round(cost, 2))
                print("Total Travel Cost (Going + Returning): ₹", round(travel_cost, 2))

            else:
                print("Invalid choice! Defaulting travel cost to 0.")
                travel_cost = 0

        else:
            print("Could not find one or both cities.")
            travel_cost = 0

        # -------- Budget --------
        try:
            budget = int(input("Enter your budget: "))
        except:
            budget = 0

        if budget < 5000:
            print("Your selection type: Local Trip")
        elif 5000 <= budget <= 15000:
            print("Your selection type: Domestic Trip")
        else:
            print("Your Selection type: Premium Trip")

        # -------- Destinations --------
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

        if city2 in Destinations:
            print(f"\n{city2} is available in our destination list.")

            visited_preferences = []

            while True:
                print("\nAvailable Preferences:")

                preferences = list(Destinations[city2].keys())
                available_preferences = []

                count = 1
                for pref in preferences:
                    if pref not in visited_preferences:
                        print(count, ".", pref)
                        available_preferences.append(pref)
                        count += 1

                if len(available_preferences) == 0:
                    print("All preferences completed")
                    break

                try:
                    pref_choice = int(input("Select your preference: "))
                except:
                    print("Invalid input")
                    continue

                if 1 <= pref_choice <= len(available_preferences):
                    selected_pref = available_preferences[pref_choice - 1]

                    print(f"\nPlaces for {selected_pref} in {city2}:")

                    places = Destinations[city2][selected_pref]

                    for i in range(len(places)):
                        print(i + 1, ".", places[i])

                    try:
                        place_choice = int(input("Select where you want to go: "))
                        selected_place = places[place_choice - 1]

                        print("\nYou selected:", selected_place)

                    except:
                        print("Invalid place selection")
                        continue

                    visited_preferences.append(selected_pref)

                    more = input("Select another preference? (yes/no): ").lower()
                    if more != "yes":
                        break
                else:
                    print("Invalid selection.")

        else:
            print("\nCity not in destination list.")

        # -------- Hotel --------
        Hotel = {
            "Omsai": {"Room": {"RK": 2000, "1BHK": 3000, "2BHK": 4000}},
            "Smile-Stone": {"Room": {"RK": 2500, "1BHK": 3500, "2BHK": 5000}},
            "7/12": {"Room": {"RK": 1500, "1BHK": 2500, "2BHK": 3500}},
            "Green-Village": {"Room": {"RK": 5000, "1BHK": 7000, "2BHK": 9000}}
        }

        print("\n--- Select Hotel ---")
        hotels = list(Hotel.keys())

        for i in range(len(hotels)):
            print(i + 1, ".", hotels[i])

        try:
            hotel_choice = int(input("Select hotel: "))
            selected_hotel = hotels[hotel_choice - 1]
        except:
            print("Invalid hotel selection")
            continue

        rooms = list(Hotel[selected_hotel]["Room"].keys())

        print("\nAvailable Rooms:")
        for i in range(len(rooms)):
            print(i + 1, ".", rooms[i], "₹", Hotel[selected_hotel]["Room"][rooms[i]])

        try:
            room_choice = int(input("Select room: "))
            selected_room = rooms[room_choice - 1]
        except:
            print("Invalid room selection")
            continue

        hotel_cost = Hotel[selected_hotel]["Room"][selected_room]

        print("\nSelected Hotel:", selected_hotel)
        print("Room Type:", selected_room)
        print("Hotel Cost: ₹", hotel_cost)

        # -------- Food --------
        Food = {
            "Maharashtrian": ["Puran-Poli: 350", "Dal-Rice: 150", "Veg-Kolhapuri: 400"],
            "Punjabi": ["Chhole-Bhature: 500", "Rajma-Chaval: 300", "Sarson da saag: 350"],
            "Gujarati": ["Jalebi: 50", "Dholka: 100", "Thepla: 150"],
            "Chinese": ["Chilli: 150", "Noodles: 200", "Manchurian: 250"]
        }

        print("\n--- Select Food Type ---")
        food_types = list(Food.keys())

        for i in range(len(food_types)):
            print(i + 1, ".", food_types[i])

        try:
            food_choice = int(input("Select food type: "))
            selected_food_type = food_types[food_choice - 1]
        except:
            print("Invalid food type")
            continue

        foods = Food[selected_food_type]

        print("\nAvailable Food Items:")
        for i in range(len(foods)):
            print(i + 1, ".", foods[i])

        try:
            food_item_choice = int(input("Select food item: "))
            selected_food = foods[food_item_choice - 1]
        except:
            print("Invalid food selection")
            continue

        food_cost = int(selected_food.split(":")[1])

        print("\nSelected Food:", selected_food)
        print("Food Cost: ₹", food_cost)

        # -------- Final Bill --------
        total_trip_cost = hotel_cost + food_cost + travel_cost

        print("\n----- BILL -----")
        print("Hotel Cost: ₹", hotel_cost)
        print("Food Cost: ₹", food_cost)
        print("Travel Cost: ₹", round(travel_cost, 2))
        print("Total Trip Cost: ₹", round(total_trip_cost, 2))

        overall_total += total_trip_cost

        print("\nYour total expenses till now: ₹", round(overall_total, 2))

        another = input("\nDo you want to add another destination? (yes/no): ").lower()
        if another != "yes":
            break

    print("\nFinal Total For All Destinations: ₹", round(overall_total, 2))
    print("Thank You for using our planner!")


# -------- Run Program --------
welcome()
start_planner()