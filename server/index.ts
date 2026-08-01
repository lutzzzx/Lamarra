import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import remindersRoutes from './routes/reminders.routes.js';
import exportImportRoutes from './routes/exportImport.routes.js';

dotenv.config();

// Ensure critical environment variables exist
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is missing! Using generated fallback for session safety.');
  process.env.JWT_SECRET = 'lamarra_prod_jwt_secret_' + Math.random().toString(36).substring(2);
}

export const app = express();

// Security Headers via Helmet (M-01)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'https://logo.clearbit.com', 'data:', 'blob:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);

// Cookie Parser for HttpOnly Auth Cookies
app.use(cookieParser());

// Restrictive CORS Configuration (H-01)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) in dev
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Request Size Limits per Route (L-02)
app.use('/api/v1/import', express.json({ limit: '5mb' }));
app.use(express.json({ limit: '1mb' }));

// Healthcheck Route (M-02) - Sanitized response
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
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
