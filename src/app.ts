import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

export default app;
