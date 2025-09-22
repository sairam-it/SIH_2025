const Joi = require('joi');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: errorMessage
      });
    }
    
    next();
  };
};

// Auth validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Hotel booking validation schema
const bookingSchema = Joi.object({
  checkIn: Joi.date().min('now').required().messages({
    'date.min': 'Check-in date cannot be in the past',
    'any.required': 'Check-in date is required'
  }),
  checkOut: Joi.date().greater(Joi.ref('checkIn')).required().messages({
    'date.greater': 'Check-out date must be after check-in date',
    'any.required': 'Check-out date is required'
  }),
  guests: Joi.object({
    adults: Joi.number().min(1).max(10).required().messages({
      'number.min': 'At least 1 adult is required',
      'number.max': 'Maximum 10 adults allowed'
    }),
    children: Joi.number().min(0).max(10).default(0).messages({
      'number.min': 'Children count cannot be negative',
      'number.max': 'Maximum 10 children allowed'
    })
  }).required(),
  roomType: Joi.string().required().messages({
    'any.required': 'Room type is required'
  }),
  specialRequests: Joi.string().max(500).optional(),
  guestDetails: Joi.object({
    primaryGuest: Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required()
    }).required(),
    additionalGuests: Joi.array().items(
      Joi.object({
        name: Joi.string().min(2).max(50).required(),
        age: Joi.number().min(0).max(120).optional()
      })
    ).optional()
  }).required()
});

// Search validation schema
const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).optional(),
  category: Joi.string().valid('heritage', 'nature', 'adventure', 'spiritual', 'modern').optional(),
  state: Joi.string().max(50).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(10),
  sort: Joi.string().valid('name', 'rating', 'price', 'createdAt').default('createdAt')
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  bookingSchema,
  searchSchema
};