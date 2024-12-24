import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.js';

const router = express.Router();

// Complete an activity
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const { activity, sentiment, completedAt } = req.body;

    const userProfile = await UserProfile.findOne({ user: req.user.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Add to completed activities
    userProfile.completedActivities = userProfile.completedActivities || [];
    userProfile.completedActivities.push({
      activity,
      sentiment,
      completedAt: new Date(completedAt)
    });

    await userProfile.save();

    // Check if user should earn a badge
    if (userProfile.completedActivities.length >= 5) {
      // Add dedication badge if not already present
      const hasDedicationBadge = userProfile.badges.some(badge => badge.type === 'dedication');
      if (!hasDedicationBadge) {
        userProfile.badges.push({
          name: 'Dedication Master',
          description: 'Completed 5 recommended activities',
          type: 'dedication',
          imageUrl: '/badges/dedication.png',
          rating: 4.5
        });
        await userProfile.save();
      }
    }

    res.json({ 
      message: 'Activity completed successfully',
      completedActivities: userProfile.completedActivities 
    });
  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ 
      message: 'Error completing activity', 
      error: error.message 
    });
  }
});

// Get activity history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json({
      completedActivities: userProfile.completedActivities || []
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    res.status(500).json({ 
      message: 'Error fetching activity history', 
      error: error.message 
    });
  }
});

export default router;

