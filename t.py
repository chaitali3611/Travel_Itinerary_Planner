from geopy.geocoders import Nominatim   #converts city name into coordinates
from geopy.distance import geodesic     #calculates distance between two locations


# -------- Welcome Function --------
def welcome():
    print(" Welcome To Our Travel Itinerary Planner ")


def start_planner():     #main function where whole program runs

    geolocator = Nominatim(user_agent="city_distance_calculator")    #geolocator object to find city locations
    overall_total = 0   ## stores total cost of all trips

    while True:    #Infinite loop until user stops

        # -------- Passenger Section --------
        try:
            num_passengers = int(input("\nEnter number of passengers: "))   #Ask user number of passengers
        except:
            print("Invalid input, defaulting to 1 passenger")
            num_passengers = 1    # # default value if error

        ages = []    ## list to store ages
        paying_passengers = 0   #counts who will pay

        for i in range(num_passengers):    #Loop runs for each passenger
            try:
                age = int(input(f"Enter age of passenger {i+1}: "))    #Ask age of each passenger
            except:
                age = 18    # default age if invalid input
            ages.append(age)   #Store age in list

        # -------- City Input --------
        city1 = input("\nEnter Source City: ").lower()
        city2 = input("Enter Destination City: ").lower()

        location1 = geolocator.geocode(city1)    # get coordinates of source
        location2 = geolocator.geocode(city2)    # get coordinates of destination

        if location1 and location2:     #Check if both cities are valid
            coords1 = (location1.latitude, location1.longitude)    # source coordinates
            coords2 = (location2.latitude, location2.longitude)     # destination coordinates

            distance = geodesic(coords1, coords2).kilometers     #Calculate distance in KM
            print(f"\nDistance between {city1} and {city2} is {round(distance, 2)} KM")
            

            mode = {
                "bus": 2,
                "train": 0.5,
                "self-car": 10,
                "flight": 30,
                "rent-car": 15
            }     # dictionary storing cost per KM for each mode

            print("\nSelect Mode of Travel:")
            for m in mode:
                print(f"{m.title()} (₹{mode[m]} per KM)")     # display travel options

            choice = input("Enter your choice: ").lower()    #User selects travel mode

            if choice in mode:
                rate = mode[choice]    # get cost per KM
                cost_per_person = distance * rate     # cost per person

                # -------- Age Logic --------
                if choice in ["bus", "train"]:
                    paying_passengers = sum(1 for age in ages if age >= 10)   #If bus/train Only passengers age ≥ 10 pay
                else:
                    paying_passengers = num_passengers     # all pay

                total_one_way = cost_per_person * paying_passengers   #One way cost
                travel_cost = total_one_way * 2    #Multiply by 2 for return

                print("\nMode of Travel:", choice)
                print("Cost per KM: ₹", rate)
                print("Paying Passengers:", paying_passengers)
                print("One Way Travel Cost: ₹", round(total_one_way, 2))
                print("Return Travel Cost: ₹", round(total_one_way, 2))
                print("Total Travel Cost (Going + Returning): ₹", round(travel_cost, 2))

            else:
                print("Invalid choice! Defaulting travel cost to 0.")
                travel_cost = 0

        else:
            print("Could not find one or both cities.")
            travel_cost = 0

        # -------- Budget --------
        try:
            budget = int(input("Enter your budget: "))   # user budget
        except:
            budget = 0

        if budget < 5000:
            print("Your selection type: Local Trip")
        elif 5000 <= budget <= 15000:
            print("Your selection type: Domestic Trip")
        else:
            print("Your Selection type: Premium Trip")

        # -------- (Rest of your code unchanged) --------

        # -------- Destinations --------
        Destinations = {    # stores cities with categories like Mall, Parks, Religious, etc.
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

        if city2 in Destinations:     #Check if destination exists
            print(f"\n{city2} is available in our destination list.")

            visited_preferences = []   #Track selected categories

            while True:
                print("\nAvailable Preferences:")

                preferences = list(Destinations[city2].keys())    # get categories
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

                    places = Destinations[city2][selected_pref]    #Get places under selected category

                    for i in range(len(places)):
                        print(i + 1, ".", places[i])

                    try:
                        place_choice = int(input("Select where you want to go: "))
                        selected_place = places[place_choice - 1]    #User selects place

                        print("\nYou selected:", selected_place)

                    except:
                        print("Invalid place selection")
                        continue

                    visited_preferences.append(selected_pref)     # mark as visited

                    more = input("Select another preference? (yes/no): ").lower()
                    if more != "yes":
                        break
                else:
                    print("Invalid selection.")

        else:
            print("\nCity not in destination list.")

        # -------- Hotel --------
        Hotel = {     # dictionary storing hotels and room prices
            "Omsai": {"Room": {"RK": 2000, "1BHK": 3000, "2BHK": 4000}},
            "Smile-Stone": {"Room": {"RK": 2500, "1BHK": 3500, "2BHK": 5000}},
            "7/12": {"Room": {"RK": 1500, "1BHK": 2500, "2BHK": 3500}},
            "Green-Village": {"Room": {"RK": 5000, "1BHK": 7000, "2BHK": 9000}}
        }

        print("\n--- Select Hotel ---")
        hotels = list(Hotel.keys())      # list of hotel names

        for i in range(len(hotels)):
            print(i + 1, ".", hotels[i])

        try:
            hotel_choice = int(input("Select hotel: "))
            selected_hotel = hotels[hotel_choice - 1]    #User selects hotel
        except:
            print("Invalid hotel selection")
            continue

        rooms = list(Hotel[selected_hotel]["Room"].keys())     # get room types

        print("\nAvailable Rooms:")
        for i in range(len(rooms)):
            print(i + 1, ".", rooms[i], "₹", Hotel[selected_hotel]["Room"][rooms[i]])

        try:
            room_choice = int(input("Select room: "))
            selected_room = rooms[room_choice - 1]
        except:
            print("Invalid room selection")
            continue

        hotel_cost = Hotel[selected_hotel]["Room"][selected_room]    #Get room cost

        print("\nSelected Hotel:", selected_hotel)
        print("Room Type:", selected_room)
        print("Hotel Cost: ₹", hotel_cost)

        # -------- Food --------
        Food = {     # dictionary of food categories
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
            selected_food = foods[food_item_choice - 1]   #Select food
        except:
            print("Invalid food selection")
            continue

        food_cost = int(selected_food.split(":")[1])   #Extract price from string

        print("\nSelected Food:", selected_food)
        print("Food Cost: ₹", food_cost)

        # -------- Final Bill --------
        total_trip_cost = hotel_cost + food_cost + travel_cost    #Total cost calculation

        print("\n----- BILL -----")
        print("Hotel Cost: ₹", hotel_cost)
        print("Food Cost: ₹", food_cost)
        print("Travel Cost: ₹", round(travel_cost, 2))
        print("Total Trip Cost: ₹", round(total_trip_cost, 2))

        overall_total += total_trip_cost    #Add to total of all trips

        print("\nYour total expenses till now: ₹", round(overall_total, 2))

        another = input("\nDo you want to add another destination? (yes/no): ").lower()    #Ask if user wants another trip
        if another != "yes":
            break     #Exit loop if no

    print("\nFinal Total For All Destinations: ₹", round(overall_total, 2))     #Show final total
    print("Thank You for using our planner!")


# -------- Run Program --------

welcome()        # call welcome function
start_planner()     # start main program