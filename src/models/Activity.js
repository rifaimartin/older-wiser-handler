const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Art & Crafts', 'Cooking', 'Health & Wellness']
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  materials: [{
    type: String
  }],
  steps: [{
    type: String
  }],
  isUserCreated: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);