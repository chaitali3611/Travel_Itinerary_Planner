export const PRESET_TRIPS = [
  {
    id: 'maharashtra-golden-triangle',
    name: 'Maharashtra Heritage & Hills Circuit',
    tagline: 'Mumbai ➔ Pune ➔ Nashik with Vineyards, Forts & Temples',
    budget: 25000,
    legs: [
      {
        leg_index: 1,
        source_city: 'mumbai',
        destination_city: 'pune',
        travel_mode: 'train',
        is_round_trip: false,
        passengers: [
          { id: 1, name: 'Aarav Sharma', age: 29 },
          { id: 2, name: 'Priya Sharma', age: 27 },
          { id: 3, name: 'Rohan Sharma', age: 7 },
          { id: 4, name: 'Grandmother', age: 66 }
        ],
        hotel: {
          hotel_name: 'Omsai',
          room_type: '1BHK',
          nights: 2
        },
        activities: [
          { category: 'Picnic Spot', place: 'Sinhagad Fort' },
          { category: 'Religious', place: 'Dagdu Sheth Ganapati' },
          { category: 'Parks & Gardens', place: 'Pu La Deshpande Garden' }
        ],
        food_orders: [
          { cuisine: 'Maharashtrian', item_name: 'Puran-Poli', quantity: 3 },
          { cuisine: 'Maharashtrian', item_name: 'Dal-Rice', quantity: 2 },
          { cuisine: 'Punjabi', item_name: 'Chhole-Bhature', quantity: 2 }
        ]
      },
      {
        leg_index: 2,
        source_city: 'pune',
        destination_city: 'nashik',
        travel_mode: 'bus',
        is_round_trip: false,
        passengers: [
          { id: 1, name: 'Aarav Sharma', age: 29 },
          { id: 2, name: 'Priya Sharma', age: 27 },
          { id: 3, name: 'Rohan Sharma', age: 7 },
          { id: 4, name: 'Grandmother', age: 66 }
        ],
        hotel: {
          hotel_name: 'Smile-Stone',
          room_type: '2BHK',
          nights: 1
        },
        activities: [
          { category: 'Picnic Spot', place: 'Sula Vineyards' },
          { category: 'Religious', place: 'Trimbakeshwar Jyotirlinga' },
          { category: 'Parks & Gardens', place: 'Godavari Riverfront Garden' }
        ],
        food_orders: [
          { cuisine: 'Gujarati', item_name: 'Thepla', quantity: 4 },
          { cuisine: 'Gujarati', item_name: 'Jalebi', quantity: 4 },
          { cuisine: 'Maharashtrian', item_name: 'Veg-Kolhapuri', quantity: 2 }
        ]
      }
    ]
  },
  {
    id: 'ajanta-ellora-expedition',
    name: 'Ajanta & Ellora Historical Pilgrimage',
    tagline: 'Pune ➔ Chhatrapati Sambhajinagar with Ancient Caves & Forts',
    budget: 18000,
    legs: [
      {
        leg_index: 1,
        source_city: 'pune',
        destination_city: 'chhatrapati sambhajinagar',
        travel_mode: 'bus',
        is_round_trip: true,
        passengers: [
          { id: 1, name: 'Vikram Mehta', age: 34 },
          { id: 2, name: 'Ananya Mehta', age: 32 },
          { id: 3, name: 'Dad (Senior)', age: 64 }
        ],
        hotel: {
          hotel_name: 'Green-Village',
          room_type: '1BHK',
          nights: 2
        },
        activities: [
          { category: 'Picnic Spot', place: 'Ajintha-Verul' },
          { category: 'Picnic Spot', place: 'Bibi Ka Maqbara' },
          { category: 'Religious', place: 'Grishneshwar Jyotirlinga' }
        ],
        food_orders: [
          { cuisine: 'Punjabi', item_name: 'Sarson da saag', quantity: 3 },
          { cuisine: 'Maharashtrian', item_name: 'Puran-Poli', quantity: 3 },
          { cuisine: 'Chinese', item_name: 'Noodles', quantity: 2 }
        ]
      }
    ]
  },
  {
    id: 'mumbai-coastal-getaway',
    name: 'Mumbai Coastal & City Lights Weekend',
    tagline: 'Ahilyanagar ➔ Mumbai with Marine Drive, Malls & ISKCON',
    budget: 14000,
    legs: [
      {
        leg_index: 1,
        source_city: 'ahilyanagar',
        destination_city: 'mumbai',
        travel_mode: 'self-car',
        is_round_trip: true,
        passengers: [
          { id: 1, name: 'Sameer Kulkarni', age: 26 },
          { id: 2, name: 'Ritu Joshi', age: 25 }
        ],
        hotel: {
          hotel_name: '7/12',
          room_type: '1BHK',
          nights: 1
        },
        activities: [
          { category: 'Picnic Spot', place: 'Marine Drive' },
          { category: 'Religious', place: 'Siddhivinayak Temple - Prabhadevi' },
          { category: 'Mall', place: 'Phoenix Palladium - Lower Parel' }
        ],
        food_orders: [
          { cuisine: 'Maharashtrian', item_name: 'Veg-Kolhapuri', quantity: 2 },
          { cuisine: 'Chinese', item_name: 'Manchurian', quantity: 2 },
          { cuisine: 'Gujarati', item_name: 'Jalebi', quantity: 2 }
        ]
      }
    ]
  }
];
