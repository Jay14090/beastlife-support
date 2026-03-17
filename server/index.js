import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envConfig } from './config/index.js';
import classifyRoute from './routes/classify.js';
import analyticsRoute from './routes/analytics.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.use('/api/classify', classifyRoute);
app.use('/api/analytics', analyticsRoute);

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(envConfig.port, () => {});
}

export default app;
