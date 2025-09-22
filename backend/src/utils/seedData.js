const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
require('dotenv').config();

// Sample destinations data
const destinations = [
  {
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
    category: "heritage",
    highlights: ["UNESCO World Heritage Site", "Mughal Architecture", "Symbol of Love", "Seven Wonders"],
    bestTime: "October to March",
    duration: "2-3 days",
    images: [{
      url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3",
      alt: "Taj Mahal"
    }],
    rating: { average: 4.8, count: 25000 },
    price: { min: 2000, max: 5000 },
    facilities: ["Parking", "Guided Tours", "Cafeteria", "Souvenir Shop"],
    nearbyAttractions: [
      { name: "Agra Fort", distance: "2.5 km" },
      { name: "Mehtab Bagh", distance: "1.5 km" }
    ]
  },
  {
    name: "Kerala Backwaters",
    state: "Kerala",
    description: "A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast of Kerala state in southern India. The backwaters were formed by the action of waves and shore currents creating low barrier islands across the mouths of the many rivers flowing down from the Western Ghats range.",
    category: "nature",
    highlights: ["Houseboat Experience", "Coconut Groves", "Traditional Villages", "Ayurveda"],
    bestTime: "November to February",
    duration: "3-4 days",
    images: [{
      url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3",
      alt: "Kerala Backwaters"
    }],
    rating: { average: 4.7, count: 18500 },
    price: { min: 3000, max: 8000 },
    facilities: ["Houseboat Rentals", "Ayurvedic Spas", "Local Cuisine", "Bird Watching"],
    nearbyAttractions: [
      { name: "Kumarakom Bird Sanctuary", distance: "5 km" },
      { name: "Vembanad Lake", distance: "2 km" }
    ]
  },
  {
    name: "Ladakh",
    state: "Ladakh",
    description: "A region administered by India as a union territory, and constituting a part of the larger Kashmir region, which has been the subject of dispute between India, Pakistan, and China since 1947. Known for its stunning landscapes, Buddhist monasteries, and adventure activities.",
    category: "adventure",
    highlights: ["High Altitude Desert", "Buddhist Monasteries", "Trekking", "Motor Biking"],
    bestTime: "May to September",
    duration: "7-10 days",
    images: [{
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
      alt: "Ladakh Landscape"
    }],
    rating: { average: 4.9, count: 12000 },
    price: { min: 5000, max: 15000 },
    facilities: ["Trekking Guides", "Camping", "Monastery Tours", "Adventure Sports"],
    nearbyAttractions: [
      { name: "Pangong Tso Lake", distance: "150 km" },
      { name: "Nubra Valley", distance: "120 km" }
    ]
  },
  {
    name: "Rajasthan Palaces",
    state: "Rajasthan",
    description: "The land of kings, Rajasthan is famous for its magnificent palaces, forts, and royal heritage. From the pink city of Jaipur to the blue city of Jodhpur, each destination tells a story of valor and grandeur.",
    category: "heritage",
    highlights: ["Royal Palaces", "Desert Safari", "Folk Culture", "Handicrafts"],
    bestTime: "October to March",
    duration: "5-7 days",
    images: [{
      url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3",
      alt: "Rajasthan Palace"
    }],
    rating: { average: 4.6, count: 22000 },
    price: { min: 4000, max: 12000 },
    facilities: ["Heritage Hotels", "Camel Safari", "Cultural Shows", "Shopping"],
    nearbyAttractions: [
      { name: "Amber Fort", distance: "11 km" },
      { name: "Hawa Mahal", distance: "5 km" }
    ]
  },
  {
    name: "Goa Beaches",
    state: "Goa",
    description: "India's smallest state by area, Goa is located on the western coast and is famous for its beaches, Portuguese heritage, and vibrant nightlife. A perfect blend of Indian and Portuguese cultures.",
    category: "nature",
    highlights: ["Pristine Beaches", "Portuguese Architecture", "Nightlife", "Water Sports"],
    bestTime: "November to March",
    duration: "4-5 days",
    images: [{
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3",
      alt: "Goa Beach"
    }],
    rating: { average: 4.5, count: 30000 },
    price: { min: 2500, max: 8000 },
    facilities: ["Beach Resorts", "Water Sports", "Nightclubs", "Spice Tours"],
    nearbyAttractions: [
      { name: "Dudhsagar Falls", distance: "60 km" },
      { name: "Old Goa Churches", distance: "10 km" }
    ]
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    description: "One of the oldest continuously inhabited cities in the world, Varanasi is the spiritual capital of India. Located on the banks of the sacred river Ganges, it's a major pilgrimage destination for Hindus.",
    category: "spiritual",
    highlights: ["Ganga Aarti", "Ancient Temples", "Ghats", "Spiritual Experience"],
    bestTime: "October to March",
    duration: "2-3 days",
    images: [{
      url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3",
      alt: "Varanasi Ghats"
    }],
    rating: { average: 4.4, count: 15000 },
    price: { min: 1500, max: 4000 },
    facilities: ["Boat Rides", "Temple Tours", "Cultural Programs", "Yoga Classes"],
    nearbyAttractions: [
      { name: "Sarnath", distance: "10 km" },
      { name: "Ramnagar Fort", distance: "14 km" }
    ]
  }
];

// Sample hotels data
const hotels = [
  {
    name: "The Oberoi Amarvilas",
    location: {
      state: "Uttar Pradesh",
      city: "Agra",
      address: "Taj East Gate Road, Agra"
    },
    description: "Luxury hotel with stunning views of the Taj Mahal. Experience unparalleled luxury with world-class amenities and services.",
    rating: 5,
    price: { amount: 25000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
      alt: "Luxury Hotel Room"
    }],
    amenities: ["Luxury Spa", "Fine Dining", "Pool", "WiFi", "Parking", "Room Service"],
    roomTypes: [
      { type: "Deluxe Room", price: 20000, capacity: 2, amenities: ["AC", "WiFi", "TV"] },
      { type: "Premier Room", price: 25000, capacity: 2, amenities: ["AC", "WiFi", "TV", "Balcony"] },
      { type: "Suite", price: 35000, capacity: 4, amenities: ["AC", "WiFi", "TV", "Living Area", "Balcony"] }
    ],
    availableRooms: 45,
    totalRooms: 102,
    contact: {
      phone: "+91-562-223-1515",
      email: "reservations@oberoihotels.com"
    }
  },
  {
    name: "Kumarakom Lake Resort",
    location: {
      state: "Kerala",
      city: "Kumarakom",
      address: "Kumarakom North P.O, Kottayam District"
    },
    description: "Heritage resort on the banks of Vembanad Lake offering traditional Kerala architecture and Ayurvedic treatments.",
    rating: 4,
    price: { amount: 15000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3",
      alt: "Kerala Resort"
    }],
    amenities: ["Ayurvedic Spa", "Lake View", "Traditional Architecture", "WiFi", "Parking"],
    roomTypes: [
      { type: "Lake View Villa", price: 15000, capacity: 2, amenities: ["AC", "WiFi", "Lake View"] },
      { type: "Heritage Villa", price: 18000, capacity: 2, amenities: ["AC", "WiFi", "Traditional Decor"] },
      { type: "Pool Villa", price: 22000, capacity: 4, amenities: ["AC", "WiFi", "Private Pool"] }
    ],
    availableRooms: 28,
    totalRooms: 35,
    contact: {
      phone: "+91-481-252-4900",
      email: "info@kumarakomlakeresort.in"
    }
  },
  {
    name: "The Grand Dragon Ladakh",
    location: {
      state: "Ladakh",
      city: "Leh",
      address: "Old Road, Sheynam, Leh"
    },
    description: "Luxury hotel in the heart of Leh with panoramic views of the surrounding mountains and traditional Ladakhi hospitality.",
    rating: 4,
    price: { amount: 12000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3",
      alt: "Mountain Hotel"
    }],
    amenities: ["Mountain View", "Traditional Decor", "Restaurant", "WiFi", "Parking"],
    roomTypes: [
      { type: "Deluxe Room", price: 10000, capacity: 2, amenities: ["Heating", "WiFi", "Mountain View"] },
      { type: "Executive Room", price: 12000, capacity: 2, amenities: ["Heating", "WiFi", "Mountain View", "Sitting Area"] },
      { type: "Suite", price: 16000, capacity: 4, amenities: ["Heating", "WiFi", "Mountain View", "Living Room"] }
    ],
    availableRooms: 32,
    totalRooms: 81,
    contact: {
      phone: "+91-1982-257-666",
      email: "reservations@granddragonladakh.com"
    }
  },
  {
    name: "Umaid Bhawan Palace",
    location: {
      state: "Rajasthan",
      city: "Jodhpur",
      address: "Umaid Bhawan Palace Road, Cantt Area"
    },
    description: "One of the world's largest private residences, now a luxury heritage hotel offering royal experience with modern amenities.",
    rating: 5,
    price: { amount: 30000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
      alt: "Palace Hotel"
    }],
    amenities: ["Royal Heritage", "Luxury Spa", "Fine Dining", "Museum", "WiFi", "Valet Parking"],
    roomTypes: [
      { type: "Palace Room", price: 28000, capacity: 2, amenities: ["Royal Decor", "WiFi", "Palace View"] },
      { type: "Royal Suite", price: 35000, capacity: 2, amenities: ["Royal Decor", "WiFi", "Palace View", "Living Area"] },
      { type: "Presidential Suite", price: 50000, capacity: 4, amenities: ["Royal Decor", "WiFi", "Palace View", "Multiple Rooms"] }
    ],
    availableRooms: 18,
    totalRooms: 64,
    contact: {
      phone: "+91-291-251-0101",
      email: "umaidbhawan@tajhotels.com"
    }
  },
  {
    name: "Taj Exotica Resort & Spa",
    location: {
      state: "Goa",
      city: "Benaulim",
      address: "Calvaddo, Benaulim Beach"
    },
    description: "Luxury beach resort spread across 56 acres of lush gardens and pristine beach, offering world-class amenities and services.",
    rating: 5,
    price: { amount: 18000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3",
      alt: "Beach Resort"
    }],
    amenities: ["Beach Access", "Luxury Spa", "Multiple Restaurants", "Pool", "WiFi", "Water Sports"],
    roomTypes: [
      { type: "Deluxe Room", price: 16000, capacity: 2, amenities: ["AC", "WiFi", "Garden View"] },
      { type: "Ocean View Room", price: 18000, capacity: 2, amenities: ["AC", "WiFi", "Ocean View"] },
      { type: "Villa", price: 25000, capacity: 4, amenities: ["AC", "WiFi", "Private Garden", "Living Area"] }
    ],
    availableRooms: 42,
    totalRooms: 140,
    contact: {
      phone: "+91-832-668-3333",
      email: "goa.exotica@tajhotels.com"
    }
  },
  {
    name: "BrijRama Palace",
    location: {
      state: "Uttar Pradesh",
      city: "Varanasi",
      address: "Darbhanga Ghat, Varanasi"
    },
    description: "Heritage hotel on the banks of river Ganges offering spiritual experience with luxury amenities and traditional architecture.",
    rating: 4,
    price: { amount: 8000, currency: "INR" },
    images: [{
      url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3",
      alt: "Heritage Hotel"
    }],
    amenities: ["Ganges View", "Heritage Architecture", "Spa", "Restaurant", "WiFi", "Cultural Programs"],
    roomTypes: [
      { type: "Heritage Room", price: 7000, capacity: 2, amenities: ["AC", "WiFi", "Traditional Decor"] },
      { type: "Ganges View Room", price: 8000, capacity: 2, amenities: ["AC", "WiFi", "River View"] },
      { type: "Suite", price: 12000, capacity: 4, amenities: ["AC", "WiFi", "River View", "Living Area"] }
    ],
    availableRooms: 25,
    totalRooms: 32,
    contact: {
      phone: "+91-542-250-0455",
      email: "info@brijrama.com"
    }
  }
];

// Seed function
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_tourism_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    console.log('Cleared existing data');

    // Insert destinations
    await Destination.insertMany(destinations);
    console.log('Destinations seeded successfully');

    // Insert hotels
    await Hotel.insertMany(hotels);
    console.log('Hotels seeded successfully');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function if called directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, destinations, hotels };