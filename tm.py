from geopy.geocoders import Nominatim
from geopy.distance import geodesic


# -------- Added New Functions --------
def welcome():
    print("Welcome To Our Travel Itinerary Planner")


def start_planner():
    
    # -------- Your Original Code Starts (Unchanged) --------

    geolocator = Nominatim(user_agent="city_distance_calculator")

    overall_total = 0

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
                print("Cost per KM: rs", mode[choice])
                print("One Way Travel Cost: rs", round(cost, 2))

                travel_cost = cost * 2

                print("Return Travel Cost: rs", round(cost,2))
                print("Total Travel Cost (Going + Returning): rs", round(travel_cost,2))

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
            "Parks & Gardens": ["Sanjay Gandhi National Park", "Hanging Gardens", "Kamala Nehru Park", "Shivaji Park"],
            "Picnic Spot": ["Marine Drive", "CSMT", "Horniman Circle", "Juhu Beach"],
            "Religious": ["Siddhivinayak", "Mumba Devi", "ISKCON", "Mahalaxmi Temple"],
        },

        "chhatrapati sambhajinagar": {
            "Mall": ["Prozone", "Reliance Mall", "Nakshatra Mall"],
            "Parks & Gardens": ["Siddharth Garden", "Smarak Garden"],
            "Picnic Spot": ["Ajintha-Verul", "Daulatabad"],
            "Religious": ["Bhadramaruti", "Grishneshwar"],
        },

        "ahilyanagar": {
            "Mall": ["Kohinoor Mall", "Trends", "Zudio"],
            "Picnic Spot": ["Kalsubai", "Bhandardara", "Harishchandragad"],
            "Religious": ["Shani Shingnapur", "Shirdi", "Kolhar"],
        },

        "pune": {
            "Mall": ["FC Road", "Phoenix Marketcity", "Amanora"],
            "Parks & Gardens": ["Saras Baug", "Empress Garden"],
            "Picnic Spot": ["Lonavala", "Sinhagad"],
            "Religious": ["Dagdu Sheth", "Jejuri"],
        },

        "nashik": {
            "Mall": ["City Centre", "Ozone Mall"],
            "Parks & Gardens": ["Pandav Leni Garden"],
            "Picnic Spot": ["Pandav Leni", "Gangapur Dam"],
            "Religious": ["Trimbakeshwar", "Kalaram Temple"],
        }
    }


        if city2 in Destinations:
            print(f"\n{city2} is available in our destination list.")

            visited_preferences=[]

            while True:

                print("\nAvailable Preferences:")

                preferences=list(Destinations[city2].keys())

                available_preferences=[]
                count=1

                for pref in preferences:
                    if pref not in visited_preferences:
                        print(count,".",pref)
                        available_preferences.append(pref)
                        count+=1

                if len(available_preferences)==0:
                    print("All preferences completed")
                    break

                pref_choice=int(input("Select your preference: "))

                if pref_choice>=1 and pref_choice<=len(available_preferences):

                    selected_pref=available_preferences[pref_choice-1]

                    print(f"\nPlaces for {selected_pref} in {city2}:")

                    for place in Destinations[city2][selected_pref]:
                        print("-",place)

                    visited_preferences.append(selected_pref)

                    more=input("Select another preference? (yes/no): ").lower()

                    if more!="yes":
                        break
                else:
                    print("Invalid preference selection.")

        else:
            print("\nThe entered city is not in our destination list.")
            for city in Destinations.keys():
                print("-",city)



        Hotel = {
            "Omsai":{"Room":{"RK":2000,"1BHK":3000,"2BHK":4000}},
            "Smile-Stone":{"Room":{"RK":2500,"1BHK":3500,"2BHK":5000}},
            "7/12":{"Room":{"RK":1500,"1BHK":2500,"2BHK":3500}},
            "Green-Village":{"Room":{"RK":5000,"1BHK":7000,"2BHK":9000}}
        }

        print("\n--- Select Hotel ---")

        hotels=list(Hotel.keys())

        for i in range(len(hotels)):
            print(i+1,".",hotels[i])

        hotel_choice=int(input("Select hotel: "))
        selected_hotel=hotels[hotel_choice-1]

        rooms=list(Hotel[selected_hotel]["Room"].keys())

        print("\nAvailable Rooms:")

        for i in range(len(rooms)):
            print(i+1,".",rooms[i],"₹",Hotel[selected_hotel]["Room"][rooms[i]])

        room_choice=int(input("Select room: "))
        selected_room=rooms[room_choice-1]

        hotel_cost=Hotel[selected_hotel]["Room"][selected_room]

        print("\nSelected Hotel:",selected_hotel)
        print("Room Type:",selected_room)
        print("Hotel Cost: ₹",hotel_cost)



        Food = {
        "Maharashtrian":["Puran-Poli: 350","Dal-Rice:150","Veg-Kolhapuri:400"],
        "Punjabi":["Chhole-Bhature:500","Rajma-Chaval:300"],
        "Gujarati":["Jalebi:50","Thepla:150"],
        "Chinese":["Chilli:150","Noodles:200"]
        }

        print("\n--- Select Food Type ---")

        food_types=list(Food.keys())

        for i in range(len(food_types)):
            print(i+1,".",food_types[i])

        food_choice=int(input("Select food type: "))
        selected_food_type=food_types[food_choice-1]

        foods=Food[selected_food_type]

        print("\nAvailable Food Items:")

        for i in range(len(foods)):
            print(i+1,".",foods[i])

        food_item_choice=int(input("Select food item: "))
        selected_food=foods[food_item_choice-1]

        food_cost=int(selected_food.split(":")[1].strip())

        print("\nSelected Food:",selected_food)
        print("Food Cost: ₹",food_cost)



        total_trip_cost=hotel_cost+food_cost+travel_cost

        print("\n----- BILL -----")
        print("Hotel Cost: ₹",hotel_cost)
        print("Food Cost: ₹",food_cost)
        print("Travel Cost (Going + Returning): ₹",round(travel_cost,2))
        print("Total Travel Cost: ₹",round(total_trip_cost,2))

        overall_total += total_trip_cost

        print("\nYour total expenses till now: ₹",round(overall_total,2))

        another_destination=input("\nDo you want to add another destination? (yes/no): ").lower()

        if another_destination!="yes":
            break


    print("\nFinal Total For All Destinations: ₹",round(overall_total,2))
    print("Thank You")


# Added function calls
welcome()
start_planner()