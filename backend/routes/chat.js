import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, language } = req.body;

    const prompt = `
      You are a mental health support chatbot. Respond to the following message in ${language}:
      User's message: "${message}"
      
      Provide a supportive and empathetic response, offering guidance or resources if appropriate.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const chatResponse = response.text();

    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      message: 'Error processing chat message', 
      error: error.message 
    });
  }
});

export default router;







