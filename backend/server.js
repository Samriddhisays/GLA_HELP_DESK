const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history = [], options = {} } = req.body;

    const isImageRequest = options.createImage ||
      prompt.toLowerCase().includes('generate image') ||
      prompt.toLowerCase().includes('create image');

    const model = isImageRequest ? "gemini-3.1-flash-image-preview" : "gemini-3-flash-preview";

    const userParts = [{ text: prompt }];
    if (options.attachment) {
      userParts.push(options.attachment);
    }

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: `You are "GLA-Mate", the super-friendly and intelligent AI assistant for students at GLA University.
        Your goal is to be a supportive companion, not just a search engine.

        TONE & PERSONALITY:
        - Enthusiastic, empathetic, and academic yet approachable.
        - Use phrases like "Hey there, scholar!", "Great question!", or "I'm here to help you succeed."

        KNOWLEDGE SCOPE:
        - Academic queries, campus life, schedules, and career advice for GLA University.

        SPECIAL INSTRUCTION:
        - At the end of your response, ALWAYS provide 2-3 relevant follow-up questions or related topics that the student might want to ask next.
        - Format these suggestions on a single line at the very end, prefixed with "SUGGESTIONS: " and separated by " | ".

        FORMATTING:
        - Use Markdown for clarity.
        - Keep responses concise but warm.`
      },
    });

    const result = {
      text: '',
      imageData: null,
      suggestions: []
    };

    let rawText = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) rawText += part.text;
      if (part.inlineData) {
        result.imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    // Parse suggestions
    const suggestionIndex = rawText.lastIndexOf("SUGGESTIONS: ");
    if (suggestionIndex !== -1) {
      const suggestionPart = rawText.substring(suggestionIndex + 13).trim();
      result.text = rawText.substring(0, suggestionIndex).trim();
      result.suggestions = suggestionPart.split('|').map(s => s.trim()).filter(s => s.length > 0);
    } else {
      result.text = rawText.trim();
    }

    res.json(result);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Unable to process your request. Please try again later.',
      text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      suggestions: []
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GLA Help Desk Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 GLA Help Desk Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});