import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const envConfig = {
  port: process.env.PORT || 3001,
  openAiApiKey: process.env.OPENAI_API_KEY,
};
