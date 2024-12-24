import { Client } from "@gradio/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  constructor() {
    this.geminiModel = null;
    this.sentimentClient = null;
    this.recommendationClient = null;

    // Initialize Gemini model and clients
    this.initializeGemini();
    this.initializeClients();
  }

  // Initialize Google Generative AI model (Gemini)
  initializeGemini() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set.');
        throw new Error('GEMINI_API_KEY is missing');
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      console.log('Gemini model initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      this.geminiModel = null;  // Ensure null if initialization fails
    }
  }

  // Initialize Gradio clients
  async initializeClients() {
    try {
      console.log('Connecting to Gradio clients...');
      this.sentimentClient = await Client.connect("jayachandru001/Mood-pred-API");
      console.log('Connected to Sentiment Prediction API.');

      this.recommendationClient = await Client.connect("jayachandru001/Mood-Based-Activity-Recommendation");
      console.log('Connected to Mood-Based Recommendation API.');

    } catch (error) {
      console.error('Error initializing Gradio clients:', error);
    }
  }

  // Detect sentiment using Gradio sentiment prediction API
  async detectSentiment(text) {
    try {
      if (!this.sentimentClient) {
        console.warn('Sentiment client is not initialized. Reinitializing...');
        await this.initializeClients();
      }

      const result = await this.sentimentClient.predict("/lambda", [text]);
      console.log('Sentiment API response:', result);

      if (!result || !result.data) {
        throw new Error('Invalid response from Sentiment API');
      }

      return {
        sentiment: result.data,
        emotion: this.mapSentimentToEmotion(result.data),
      };
    } catch (error) {
      console.error('Error detecting sentiment:', error);
      throw new Error('Failed to analyze sentiment. Please try again later.');
    }
  }

  // Get activity recommendations based on mood and description
  async getRecommendations(mood, description) {
    try {
      if (!this.recommendationClient) {
        console.warn('Recommendation client is not initialized. Reinitializing...');
        await this.initializeClients();
      }

      const result = await this.recommendationClient.predict("/predict", [description, mood]);
      console.log('Recommendation API response:', result);

      if (!result || !result.data) {
        throw new Error('Invalid response from Recommendation API');
      }

      return Array.isArray(result.data) ? result.data : [result.data];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations. Please try again later.');
    }
  }

  // Generate personalized response using Gemini
  async getPersonalizedResponse(userContext, currentMood, previousMood) {
    try {
      if (!this.geminiModel) {
        console.warn('Gemini model is not initialized. Reinitializing...');
        this.initializeGemini();
        if (!this.geminiModel) throw new Error('Gemini model is unavailable');
      }

      const systemPrompt = `You are an AI chatbot "Aura" providing empathetic mental health check-ins.\nUser Info: Name: ${userContext.name}, Mood: ${currentMood.sentiment}, Stress: ${currentMood.stressLevel}`;

      const chatSession = this.geminiModel.startChat({ history: [], systemPrompt });
      const result = await chatSession.sendMessage(currentMood.journalEntry);
      console.log('Gemini response:', result);

      return result.response.text();
    } catch (error) {
      console.error('Error getting personalized response:', error);
      throw new Error('Failed to generate personalized response. Please try again later.');
    }
  }

  // Map sentiment to emotion
  mapSentimentToEmotion(sentiment) {
    const emotionMap = {
      positive: 'happy',
      negative: 'sad',
      neutral: 'neutral',
    };
  
    // Handle cases where sentiment is an array
    if (Array.isArray(sentiment)) {
      sentiment = sentiment[0] || 'neutral'; // Default to 'neutral' if array is empty
    }
  
    // Ensure sentiment is a string before calling toLowerCase
    if (typeof sentiment === 'string') {
      return emotionMap[sentiment.toLowerCase()] || 'neutral';
    }
  
    // Fallback to 'neutral' for invalid types
    return 'neutral';
  }
}

export default new AIService();









