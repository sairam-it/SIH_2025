const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['heritage', 'nature', 'adventure', 'spiritual', 'modern'],
    lowercase: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
  bestTime: {
    type: String,
    required: [true, 'Best time to visit is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String, // For Cloudinary
    alt: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  price: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  facilities: [{
    type: String,
    trim: true
  }],
  nearbyAttractions: [{
    name: String,
    distance: String
  }],
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
destinationSchema.index({
  name: 'text',
  description: 'text',
  state: 'text',
  highlights: 'text'
});

// Create compound indexes for filtering
destinationSchema.index({ category: 1, state: 1 });
destinationSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Destination', destinationSchema);