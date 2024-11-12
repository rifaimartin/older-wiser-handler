const ActivityService = require('../services/ActivityService');
const ResponseFormatter = require('../utils/ResponseFormatter');

class ActivityController {
  static async getAllActivities(req, res, next) {
    try {
      const activities = await ActivityService.getAllActivities();
      return ResponseFormatter.success(res, activities, 'Activities retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getActivityById(req, res, next) {
    try {
      const activity = await ActivityService.getActivityById(req.params.id);
      if (!activity) {
        return ResponseFormatter.error(res, 'Activity not found', 404);
      }
      return ResponseFormatter.success(res, activity, 'Activity retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createActivity(req, res, next) {
    try {
      const activity = await ActivityService.createActivity(req.body);
      return ResponseFormatter.success(res, activity, 'Activity created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateActivity(req, res, next) {
    try {
      const activity = await ActivityService.updateActivity(req.params.id, req.body);
      if (!activity) {
        return ResponseFormatter.error(res, 'Activity not found', 404);
      }
      return ResponseFormatter.success(res, activity, 'Activity updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteActivity(req, res, next) {
    try {
      const activity = await ActivityService.deleteActivity(req.params.id);
      if (!activity) {
        return ResponseFormatter.error(res, 'Activity not found', 404);
      }
      return ResponseFormatter.success(res, null, 'Activity deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;