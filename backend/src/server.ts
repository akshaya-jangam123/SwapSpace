import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route Imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import skillRoutes from './routes/skill.routes';
import itemRoutes from './routes/item.routes';
import exchangeRoutes from './routes/exchange.routes';
import matchRoutes from './routes/match.routes';
import messageRoutes from './routes/message.routes';
import reviewRoutes from './routes/review.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();

// Trust proxy for Render / Cloud hosting
app.set('trust proxy', 1);

// Allowed Origins Configuration
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5174',
  'https://swapspace-2.onrender.com',
  'https://swap-space-744kper23-akshaya-666d.vercel.app',
];

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Allow non-browser clients, server-to-server, curl, Postman
  const cleanOrigin = origin.replace(/\/+$/, '');

  if (allowedOrigins.includes(cleanOrigin)) return true;

  // Allow all Vercel deployments (including preview deployments)
  if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(cleanOrigin) || /^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) {
    return true;
  }

  // Allow localhost with any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
    return true;
  }

  // Allow Render services
  if (/^https:\/\/.*\.onrender\.com$/.test(cleanOrigin)) {
    return true;
  }

  return true; // Fallback to allow client connection
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health check endpoints
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'SwapSpace REST API',
    version: '1.0.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'SwapSpace API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [SwapSpace Backend] Server running on http://localhost:${PORT}`);
});

export default app;
