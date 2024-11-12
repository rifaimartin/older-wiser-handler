const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Activity', activitySchema);