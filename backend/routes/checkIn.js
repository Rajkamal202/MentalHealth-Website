import express from 'express';
import Joi from 'joi';
import CheckIn from '../models/CheckIn.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation schema
const checkInSchema = Joi.object({
  mood: Joi.number().min(1).max(10).required(),
  stressLevel: Joi.number().min(1).max(10).required(),
  journal: Joi.string().required(),
});

// Create check-in
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const { error } = checkInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { mood, stressLevel, journal } = req.body;
    const checkIn = new CheckIn({
      user: req.user.userId,
      mood,
      stressLevel,
      journal,
    });
    
    await checkIn.save();
    res.status(201).json(checkIn);
  } catch (error) {
    console.error('Error creating check-in:', error);
    res.status(500).json({ message: 'Error creating check-in', error: error.message });
  }
});

// Get user's check-ins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const totalMood = checkIns.reduce((sum, checkIn) => sum + checkIn.mood, 0);
    const totalStress = checkIns.reduce((sum, checkIn) => sum + checkIn.stressLevel, 0);
    const averageMood = checkIns.length > 0 ? (totalMood / checkIns.length).toFixed(1) : 0;
    const averageStress = checkIns.length > 0 ? (totalStress / checkIns.length).toFixed(1) : 0;

    res.json({
      checkIns,
      stats: {
        averageMood,
        averageStress,
        totalCheckIns: checkIns.length
      }
    });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    res.status(500).json({ message: 'Error fetching check-ins', error: error.message });
  }
});

export default router;






