import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // remove `.js` for TypeScript compatibility


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
console.log('🌐 Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URI as string, {
  serverApi: { version: '1' } // Fallback config for newer SRV drivers
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  app.use(cors({
    origin: 'http://localhost:5173', // your frontend's dev server
    credentials: true
  }));
// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
