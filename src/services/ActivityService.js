const Activity = require('../models/Activity');

class ActivityService {
  static async getAllActivities(query = {}) {
    return await Activity.find(query);
  }

  static async getActivityById(id) {
    return await Activity.findById(id);
  }

  static async createActivity(data) {
    return await Activity.create(data);
  }

  static async updateActivity(id, data) {
    return await Activity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteActivity(id) {
    return await Activity.findByIdAndDelete(id);
  }
}

module.exports = ActivityService;