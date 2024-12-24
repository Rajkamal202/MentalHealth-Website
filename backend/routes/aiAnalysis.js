import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import aiService from '../services/aiService.js';
import UserProfile from '../models/UserProfile.js';
import CheckIn from '../models/CheckIn.js';

const router = express.Router();

router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { text, mood, stressLevel } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing "text" input' });
    }

    // Get sentiment and emotion analysis
    const sentimentResult = await aiService.detectSentiment(text);
    console.log('Sentiment analysis result:', sentimentResult);

    // Get personalized recommendations
    const recommendations = await aiService.getRecommendations(
      mood || sentimentResult.sentiment,
      text
    );
    console.log('Recommendations:', recommendations);

    // Get user context
    const userProfile = await UserProfile.findOne({ user: req.user.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const previousCheckIn = await CheckIn.findOne({
      user: req.user.userId
    }).sort({ createdAt: -1 });

    const userContext = {
      name: userProfile.name || 'User',
      age: userProfile.age || 'unspecified',
      gender: userProfile.gender || 'unspecified',
      goal: (userProfile.goals && userProfile.goals[0]) || 'improve mental wellbeing'
    };

    const currentMood = {
      sentiment: sentimentResult.sentiment || 'neutral',
      emotion: sentimentResult.emotion || 'neutral',
      stressLevel: stressLevel || 5,
      journalEntry: text
    };

    const previousMood = previousCheckIn
      ? {
          sentiment: previousCheckIn.mood || 'neutral',
          stressLevel: previousCheckIn.stressLevel || 5,
          emotion: 'unspecified'
        }
      : {
          sentiment: 'neutral',
          stressLevel: 5,
          emotion: 'neutral'
        };

    // Get personalized response using Gemini
    const personalizedResponse = await aiService.getPersonalizedResponse(
      userContext,
      currentMood,
      previousMood
    );
    console.log('Personalized Response:', personalizedResponse);

    res.json({
      sentiment: sentimentResult.sentiment,
      emotion: sentimentResult.emotion,
      recommendations,
      personalizedResponse
    });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({
      message: 'Error analyzing input',
      error: error.message
    });
  }
});

export default router;






























