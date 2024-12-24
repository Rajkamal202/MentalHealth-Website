import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
      You are a supportive AI assistant for a mental health application. 
      Respond to the following message with empathy and care:
      User's message: "${message}"
      
      Provide a supportive and helpful response, offering guidance or resources if appropriate.
      Keep the response concise, around 2-3 sentences.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      message: 'Error processing chat message', 
      error: error.message 
    });
  }
});

export default router;



