const ActivityService = require('../services/ActivityService');
const ResponseFormatter = require('../utils/ResponseFormatter');
const Activity = require('../models/Activity');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure upload directory exists
const uploadDir = 'uploads/activities';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for activity images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image file'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');

class ActivityController {

  static async uploadImage(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'Please upload an image'
          });
        }

        res.json({
          success: true,
          data: {
            filename: req.file.filename,
            path: `/uploads/activities/${req.file.filename}`
          }
        });
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading file'
      });
    }
  }

  // Create activity handler
  static async createActivity(req, res) {
    try {
      const {
        title,
        image,
        duration,
        category,
        description,
        difficulty = 'Beginner',
        materials = [],
        steps = [],
        email
      } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      console.log(user._id + "apaan cuy")

      // Create new activity
      const activity = await Activity.create({
        title,
        image,
        duration,
        category,
        description,
        difficulty,
        materials: typeof materials === 'string' ? JSON.parse(materials) : materials,
        steps: typeof steps === 'string' ? JSON.parse(steps) : steps,
        email,
        createdBy: user._id
      });

      res.status(201).json({
        success: true,
        message: 'Activity created successfully jacnok',
        data: activity
      });

    } catch (error) {
      console.error('Create activity error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.errors
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getUserCreatedActivities(req, res) {
    try {
      console.log('Fetching user created activities...');
      
      const activities = await Activity.find({ isUserCreated: true })
        .populate({
          path: 'createdBy',
          select: 'name email imageUrl' // pilih fields yang dibutuhkan dari User
        })
        .sort({ createdAt: -1 });
  
      // console.log('Found activities:', activities);
  
      // Transform response jika perlu
      const formattedActivities = activities.map(activity => ({
        id: activity._id,
        title: activity.title,
        image: activity.image,
        duration: activity.duration,
        category: activity.category,
        description: activity.description,
        difficulty: activity.difficulty,
        materials: activity.materials,
        steps: activity.steps,
        createdBy: {
          id: activity.createdBy?._id,
          name: activity.createdBy?.name || 'Anonymous',
          email: activity.createdBy?.email,
          imageUrl: activity.createdBy?.imageUrl
        },
        likes: activity.likes,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      }));
  
      res.json({
        success: true,
        data: formattedActivities
      });
    } catch (error) {
      console.error('Get user created activities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getUserActivities(req, res) {
    try {
      const { email } = req.params;
      
      const activities = await Activity.find({ 
        email: email,
        isUserCreated: true 
      })
      .sort('-createdAt')
      .select('title category image');
  
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Get user activities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }



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
        return ResponseFormatter.error(res, 'Activity not found jancok', 404);
      }
      return ResponseFormatter.success(res, activity, 'Activity retrieved successfully');
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