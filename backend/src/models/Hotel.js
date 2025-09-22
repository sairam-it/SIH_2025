const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      default: 'night'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String, // For Cloudinary
    alt: String
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  roomTypes: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    amenities: [String],
    available: {
      type: Boolean,
      default: true
    }
  }],
  availableRooms: {
    type: Number,
    required: [true, 'Available rooms count is required'],
    min: 0
  },
  totalRooms: {
    type: Number,
    required: [true, 'Total rooms count is required'],
    min: 1
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  policies: {
    cancellation: String,
    petPolicy: String,
    smokingPolicy: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create text index for search
hotelSchema.index({
  name: 'text',
  description: 'text',
  'location.city': 'text',
  'location.state': 'text'
});

// Create compound indexes for filtering
hotelSchema.index({ 'location.state': 1, 'location.city': 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ 'price.amount': 1 });

module.exports = mongoose.model('Hotel', hotelSchema);