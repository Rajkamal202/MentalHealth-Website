import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Joi from 'joi';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Validation schema
const onboardingSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required().min(13).max(120),
  currentMentalHealth: Joi.string().required(),
  joinReason: Joi.string().allow(''),
  goals: Joi.array().items(Joi.string()).required(),
  sleepPattern: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor', 'Struggling').required(),
  stressLevel: Joi.number().min(1).max(10).required(),
  socialConnection: Joi.string().valid('Strong', 'Moderate', 'Weak', 'Isolated').required(),
  mentalHealthConcerns: Joi.array().items(Joi.string()).required(),
  exerciseFrequency: Joi.string().valid('daily', '3-4-times-week', '1-2-times-week', 'rarely', 'never').required(),
  dietQuality: Joi.string().valid('excellent', 'good', 'fair', 'poor').required(),
  substanceUse: Joi.string().required(),
  copingMechanisms: Joi.string().required(),
});

router.post('/onboarding', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const { error } = onboardingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    const { 
      name, age, currentMentalHealth, joinReason, goals, 
      sleepPattern, stressLevel, socialConnection, mentalHealthConcerns,
      exerciseFrequency, dietQuality, substanceUse, copingMechanisms
    } = req.body;

    // Check if profile already exists
    let userProfile = await UserProfile.findOne({ user: req.user.userId });
    
    if (userProfile) {
      // Update existing profile
      userProfile.name = name;
      userProfile.age = age;
      userProfile.currentMentalHealth = currentMentalHealth;
      userProfile.joinReason = joinReason;
      userProfile.goals = goals;
      userProfile.sleepPattern = sleepPattern;
      userProfile.stressLevel = stressLevel;
      userProfile.socialConnection = socialConnection;
      userProfile.mentalHealthConcerns = mentalHealthConcerns;
      userProfile.exerciseFrequency = exerciseFrequency;
      userProfile.dietQuality = dietQuality;
      userProfile.substanceUse = substanceUse;
      userProfile.copingMechanisms = copingMechanisms;
      userProfile.onboardingCompleted = true;
    } else {
      // Create new profile
      userProfile = new UserProfile({
        user: req.user.userId,
        name,
        age,
        currentMentalHealth,
        joinReason,
        goals,
        sleepPattern,
        stressLevel,
        socialConnection,
        mentalHealthConcerns,
        exerciseFrequency,
        dietQuality,
        substanceUse,
        copingMechanisms,
        onboardingCompleted: true,
      });
    }

    await userProfile.save();

    // Generate personalized recommendations using Gemini
    const prompt = ` 
      Based on the following user profile, provide 3-4 personalized recommendations for improving mental health:
      - Current mental health: ${currentMentalHealth}
      - Goals: ${goals.join(', ')}
      - Sleep pattern: ${sleepPattern}
      - Stress level: ${stressLevel}
      - Social connection: ${socialConnection}
      - Mental health concerns: ${mentalHealthConcerns.join(', ')}
      - Exercise frequency: ${exerciseFrequency}
      - Diet quality: ${dietQuality}
      - Substance use: ${substanceUse}
      - Coping mechanisms: ${copingMechanisms}

      Format the response as a JSON array of objects with 'title' and 'description' fields.
      Focus on practical, actionable advice related to the user's specific situation and goals.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let recommendations = [];
    
    try {
      recommendations = JSON.parse(response.text());
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      recommendations = [{
        title: "Start with Mindfulness",
        description: "Begin with 5 minutes of daily mindful breathing exercises."
      }];
    }

    res.status(201).json({
      profile: userProfile,
      recommendations,
    });
  } catch (error) {
    console.error('Error in onboarding:', error);
    res.status(500).json({ 
      message: 'Error processing onboarding', 
      error: error.message 
    });
  }
});

router.get('/onboarding-status', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.userId });
    res.json({ onboardingCompleted: profile?.onboardingCompleted || false });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    res.status(500).json({ 
      message: 'Error checking onboarding status', 
      error: error.message 
    });
  }
});

export default router;










