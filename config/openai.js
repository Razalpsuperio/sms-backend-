import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

// Check if the environment variable is set
if (!process.env.OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;