import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import exportImportRoutes from './routes/exportImport.routes.js';

dotenv.config();

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck Route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Lamarra Full-Stack API' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/jobs', timelineRoutes);
app.use('/api/v1', remindersRoutes);
app.use('/api/v1', exportImportRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;

// Only start listening when run directly, not when imported as serverless handler
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Lamarra PostgreSQL API Server running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/v1/health`);
    console.log(`==================================================`);
  });
}

export default app;
