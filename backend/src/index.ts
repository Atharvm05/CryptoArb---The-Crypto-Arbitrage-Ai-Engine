import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { setupWebSocketServer } from './websocket/wsServer';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Set up REST API routes
app.use('/api', apiRoutes);

// General health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Set up WebSocket server
setupWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
