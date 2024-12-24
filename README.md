# Intelligent Web Platform for Mental Health Support

## Overview
This repository contains the source code and documentation for the **Intelligent Web Platform** aimed at providing mental health support. The platform integrates modern web development technologies and AI-powered features to offer personalized user experiences.

## Features
1. **User Authentication**:
   - Secure registration and login system.
   - Session management using JSON Web Tokens (JWT).

2. **Activity Tracker**:
   - Log daily activities and moods.
   - Securely store user data for trend analysis.

3. **AI-Powered Analysis**:
   - Analyze mood and activity data using AI models.
   - Provide actionable suggestions and real-time support via multilingual chat.

4. **Personalized Dashboard**:
   - Visualize mood trends and activity insights using charts.
   - Display AI-generated recommendations.

5. **Resource Integration**:
   - Links to external mental health resources and guides.

## Technology Stack
### Frontend:
- **Framework**: React
- **Styling**: TailwindCSS
- **Visualization**: Recharts
- **State Management**: Context API

### Backend:
- **Framework**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **AI Integration**: Gradio and @google/generative-ai

## Prerequisites
- Node.js (v16 or above)
- MongoDB (local or cloud instance)
- Environment Variables:
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT
  - `PORT`: Port number for the backend

## Installation
1. Clone the repository:
   ```bash
   git clone [repository link]
   cd [repository folder]
   ```

2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` folder with the required variables:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     PORT=5000
     GEMINI_API_KEY= geminiapi key
     ```

4. Start the development server:
   ```bash
   # Backend
   npm run dev or npx nodemon server.js

   # Frontend
   cd ../frontend
   npm run dev
