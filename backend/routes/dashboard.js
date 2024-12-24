import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.js';
import CheckIn from '../models/CheckIn.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function to format date
const formatDate = (date) => date.toISOString().split('T')[0];

// Get dashboard data
router.get('/data', authenticateToken, async (req, res) => {
  try {
    // Validate user ID
    if (!isValidObjectId(req.user.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find or create user profile
    let profile = await UserProfile.findOne({ user: req.user.userId });
    if (!profile) {
      profile = new UserProfile({
        user: req.user.userId,
        name: 'User',
        age: 25,
        currentMentalHealth: 'Good',
        goals: [],
        badges: [],
        completedTasks: [],
        stepHistory: [],
        sleepHistory: [],
        moodHistory: []
      });
      await profile.save();
    }

    // Get check-ins
    const checkIns = await CheckIn.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Calculate mood data and statistics
    const moodDataFromCheckIns = checkIns.map(checkIn => ({
      date: formatDate(checkIn.createdAt),
      mood: checkIn.mood || 0
    }));

    const averageMoodFromCheckIns = checkIns.length > 0
      ? (checkIns.reduce((sum, checkIn) => sum + (checkIn.mood || 0), 0) / checkIns.length).toFixed(2)
      : 0;

    // Get last 7 days of health data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stepData = profile.stepHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        steps: entry.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const sleepData = profile.sleepHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        hours: entry.duration
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get mood data for the last 7 days
    const moodData = profile.moodHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        rating: entry.rating
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate average mood
    const averageMood = moodData.length > 0
      ? (moodData.reduce((sum, entry) => sum + entry.rating, 0) / moodData.length).toFixed(2)
      : 0;


    // Prepare recommendations
    const recommendations = [
      {
        title: "Daily Meditation",
        description: "Start with 5 minutes of mindful breathing",
        type: "mental"
      },
      {
        title: "Physical Activity",
        description: "Aim for a 10-minute walk today",
        type: "physical"
      },
      {
        title: "Sleep Hygiene",
        description: "Set a consistent bedtime routine",
        type: "physical"
      },
      {
        title: "Mindful Journaling",
        description: "Write down three things you're grateful for",
        type: "mental"
      }
    ];

    res.json({
      profile,
      moodData,
      averageMood: parseFloat(averageMood),
      totalCheckIns: checkIns.length,
      stepData,
      sleepData,
      recommendations
    });

  } catch (error) {
    console.error('Error in /dashboard/data:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Update health data
router.post('/update-health-data', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const { stepCount, sleepDuration } = req.body;

    if (stepCount === undefined && sleepDuration === undefined) {
      return res.status(400).json({
        message: 'At least one of stepCount or sleepDuration must be provided'
      });
    }

    // Validate user ID
    if (!isValidObjectId(req.user.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find user profile
    const profile = await UserProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update step count
    if (stepCount !== undefined) {
      const steps = parseInt(stepCount);
      if (isNaN(steps) || steps < 0) {
        return res.status(400).json({ message: 'Invalid step count value' });
      }

      const existingStepIndex = profile.stepHistory.findIndex(
        entry => entry.date.getTime() === today.getTime()
      );

      if (existingStepIndex !== -1) {
        profile.stepHistory[existingStepIndex].count = steps;
      } else {
        profile.stepHistory.push({ date: today, count: steps });
      }
    }

    // Update sleep duration
    if (sleepDuration !== undefined) {
      const sleep = parseFloat(sleepDuration);
      if (isNaN(sleep) || sleep < 0 || sleep > 24) {
        return res.status(400).json({ message: 'Invalid sleep duration value' });
      }

      const existingSleepIndex = profile.sleepHistory.findIndex(
        entry => entry.date.getTime() === today.getTime()
      );

      if (existingSleepIndex !== -1) {
        profile.sleepHistory[existingSleepIndex].duration = sleep;
      } else {
        profile.sleepHistory.push({ date: today, duration: sleep });
      }
    }

    // Save profile changes
    await profile.save();

    // Prepare updated data for response
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stepData = profile.stepHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        steps: entry.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const sleepData = profile.sleepHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        hours: entry.duration
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      message: 'Health data updated successfully',
      profile: {
        ...profile.toObject(),
        stepHistory: stepData,
        sleepHistory: sleepData
      }
    });

  } catch (error) {
    console.error('Error updating health data:', error);
    res.status(500).json({
      message: 'Error updating health data',
      error: error.message
    });
  }
});

// Complete task
router.post('/complete-task', authenticateToken, async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    const profile = await UserProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (!profile.completedTasks.includes(task)) {
      profile.completedTasks.push(task);
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      message: 'Error completing task',
      error: error.message
    });
  }
});

// Share badge
router.post('/share-badge', authenticateToken, async (req, res) => {
  try {
    const { badgeId, platform } = req.body;

    if (!badgeId || !platform) {
      return res.status(400).json({ message: 'Badge ID and platform are required' });
    }

    const profile = await UserProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const badge = profile.badges.id(badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    badge.shared[platform] = true;
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error('Error sharing badge:', error);
    res.status(500).json({
      message: 'Error sharing badge',
      error: error.message
    });
  }
});

// Update mood
router.post('/update-mood', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid mood rating' });
    }

    const profile = await UserProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMoodIndex = profile.moodHistory.findIndex(
      entry => entry.date.getTime() === today.getTime()
    );

    if (existingMoodIndex !== -1) {
      profile.moodHistory[existingMoodIndex].rating = rating;
    } else {
      profile.moodHistory.push({ date: today, rating });
    }

    await profile.save();

    // Prepare updated data for response
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodData = profile.moodHistory
      .filter(entry => entry.date >= sevenDaysAgo)
      .map(entry => ({
        date: formatDate(entry.date),
        rating: entry.rating
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      message: 'Mood updated successfully',
      moodData
    });

  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({
      message: 'Error updating mood',
      error: error.message
    });
  }
});

export default router;













