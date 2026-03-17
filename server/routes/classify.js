import express from 'express';
import OpenAI from 'openai';
import { envConfig } from '../config/index.js';
import { queriesStore } from './analytics.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

const openai = new OpenAI({
  apiKey: envConfig.openAiApiKey,
});

router.post('/', validateRequest, async (req, res) => {
  try {
    const { message } = req.body;
    
    const systemPrompt = "You are a customer support AI for Beastlife, a fitness nutrition brand. Analyze the customer message and return ONLY a raw JSON object — no markdown, no backticks, no preamble. Use exactly these fields: category (one of: Order Tracking, Delivery Delay, Refund Request, Product Complaint, Payment Failure, Subscription Issue, General Query), confidence (high or medium or low), sentiment (positive or neutral or frustrated or angry), priority (urgent or high or normal or low), summary (maximum 12 words describing the issue), suggestedResponse (a professional 60-word customer service reply), automationAction (one sentence describing what automated system action would resolve this without a human agent).";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.1,
    });

    const responseText = completion.choices[0].message.content.trim();
    const parsedData = JSON.parse(responseText);
    
    const sources = ['WhatsApp', 'Instagram', 'Email'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    const queryEntry = {
      id: Date.now().toString(),
      text: message,
      source: randomSource,
      createdAt: new Date().toISOString(),
      ...parsedData
    };

    queriesStore.unshift(queryEntry);

    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: 'Classification failed' });
  }
});

export default router;
