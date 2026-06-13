const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Store rider locations in memory
const riderLocations = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Rider sends location update
  socket.on('rider:location', ({ orderId, lat, lng }) => {
    riderLocations[orderId] = { lat, lng };
    // Broadcast to everyone watching this order
    io.emit(`order:location:${orderId}`, { lat, lng });
  });

  // Order status update
  socket.on('order:status', ({ orderId, status }) => {
    io.emit(`order:status:${orderId}`, { status });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible in controllers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});