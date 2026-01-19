import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import authRoutes from './routes/auth.ts';
import labourRoutes from './routes/labour.ts';
import adminRoutes from './routes/admin.ts';
import enterpriseRoutes from './routes/enterprise.ts';
import workerRoutes from './routes/worker.ts';
import publicRoutes from './routes/public.ts';
import verifyRoutes from './routes/verify.ts';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/verify', verifyRoutes);

// Error Handler
app.use(errorHandler);

export default app;
