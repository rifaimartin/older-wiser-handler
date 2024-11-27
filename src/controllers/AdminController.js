// controllers/AdminController.js
const Activity = require('../models/Activity');
const User = require('../models/User');

class AdminController {
 static async getAllActivities(req, res) {
   try {
     const activities = await Activity.find()
       .sort({ createdAt: -1 });

     res.json({
       success: true,
       data: activities
     });
   } catch (error) {
     console.error('Get activities error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to get activities'
     });
   }
 }

 static async createActivity(req, res) {
   try {
     const { title, description, category, image } = req.body;

     const activity = await Activity.create({
       title,
       description,
       category,
       image
     });

     res.status(201).json({
       success: true,
       data: activity
     });
   } catch (error) {
     console.error('Create activity error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to create activity'
     });
   }
 }

 static async updateActivity(req, res) {
   try {
     const { id } = req.params;
     const updateData = req.body;

     const activity = await Activity.findByIdAndUpdate(
       id,
       updateData,
       { new: true, runValidators: true }
     );

     if (!activity) {
       return res.status(404).json({
         success: false,
         message: 'Activity not found'
       });
     }

     res.json({
       success: true,
       data: activity
     });
   } catch (error) {
     console.error('Update activity error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to update activity'
     });
   }
 }

 static async deleteActivity(req, res) {
   try {
     const { id } = req.params;
     
     const activity = await Activity.findByIdAndDelete(id);

     if (!activity) {
       return res.status(404).json({
         success: false,
         message: 'Activity not found'
       });
     }

     res.json({
       success: true,
       message: 'Activity deleted successfully'
     });
   } catch (error) {
     console.error('Delete activity error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to delete activity'
     });
   }
 }

 static async getAllUsers(req, res) {
   try {
     const users = await User.find()
       .select('-password')
       .sort({ createdAt: -1 });

     res.json({
       success: true,
       data: users
     });
   } catch (error) {
     console.error('Get users error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to get users'
     });
   }
 }

 static async updateUser(req, res) {
   try {
     const { id } = req.params;
     const updateData = req.body;

     const user = await User.findByIdAndUpdate(
       id,
       updateData,
       { new: true, runValidators: true }
     ).select('-password');

     if (!user) {
       return res.status(404).json({
         success: false,
         message: 'User not found'
       });
     }

     res.json({
       success: true,
       data: user
     });
   } catch (error) {
     console.error('Update user error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to update user'
     });
   }
 }

 static async getDashboardStats(req, res) {
   try {
     const totalUsers = await User.countDocuments();
     const totalActivities = await Activity.countDocuments();
     const premiumUsers = await User.countDocuments({ membershipLevel: 'premium' });
     const goldUsers = await User.countDocuments({ membershipLevel: 'gold' });

     res.json({
       success: true,
       data: {
         totalUsers,
         totalActivities,
         premiumUsers,
         goldUsers
       }
     });
   } catch (error) {
     console.error('Get dashboard stats error:', error);
     res.status(500).json({
       success: false,
       message: 'Failed to get dashboard statistics'
     });
   }
 }
}

module.exports = AdminController;