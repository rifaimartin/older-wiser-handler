const ActivityService = require('../services/ActivityService');
const ResponseFormatter = require('../utils/ResponseFormatter');
const Activity = require('../models/Activity');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');


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
        images,
      } = req.body;

      // Ambil email langsung dari req.user (tidak perlu destructuring)
      const email = req.user.email;

      logger.info('Creating new activity', {
        email,
        title,
        category,
        user: req.user // log full user object untuk debug
      });

      // Find user (technically tidak perlu find lagi karena sudah ada di req.user)
      const user = {
        _id: req.user.id,
        email: req.user.email
      };

      logger.debug('User data:', user);

      // Parse arrays if needed
      let parsedMaterials = materials;
      let parsedSteps = steps;
      try {
        if (typeof materials === 'string') {
          parsedMaterials = JSON.parse(materials);
          logger.debug('Parsed materials array', { materials: parsedMaterials });
        }
        if (typeof steps === 'string') {
          parsedSteps = JSON.parse(steps);
          logger.debug('Parsed steps array', { steps: parsedSteps });
        }
      } catch (err) {
        logger.error('Error parsing arrays', {
          error: err.message,
          materials,
          steps
        });
      }

      // Create new activity
      const activity = await Activity.create({
        title,
        image,
        images,
        duration,
        category,
        description,
        difficulty,
        materials: parsedMaterials,
        steps: parsedSteps,
        email: user.email,      // Use email from req.user
        createdBy: user._id     // Use id from req.user
      });

      logger.info('Activity created successfully', {
        activityId: activity._id,
        userId: user._id,
        title: activity.title
      });

      res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        data: activity
      });

    } catch (error) {
      logger.error('Create activity error:', {
        error: error.message,
        stack: error.stack,
        body: req.body,
        user: req.user
      });

      if (error.name === 'ValidationError') {
        logger.warn('Validation error', {
          errors: error.errors,
          body: req.body
        });

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

  static async bulkUpload(req, res) {
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
  
        const imagePath = `/uploads/activities/${req.file.filename}`;
  
        res.json({
          success: true,
          data: {
            path: imagePath
          }
        });
      });
    } catch (error) {
      logger.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading file'
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