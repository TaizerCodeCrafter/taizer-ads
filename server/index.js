import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import apiRoutes from './routes/api.js';

// Ensure DNS lookups for MongoDB Atlas SRV resolve reliably
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('Custom DNS set warning:', dnsErr.message);
}

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Taizer Ads API Server',
    version: '1.0.0',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB
async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not found in .env file. Running in offline/fallback mode.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ Successfully connected to MongoDB Atlas / Database!');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️  Backend will continue running. Frontend will use offline fallback until MongoDB credentials are corrected.');
  }
}

mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connection established.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('🟡 MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB error event:', err.message);
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Taizer Ads Express API Server running on http://localhost:${PORT}`);
  await connectToDatabase();
});
