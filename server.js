require('dotenv').config();

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const app = express();

const roomController = require('./controllers/rooms');
const gameController = require('./controllers/games');
const jwt = require('jsonwebtoken');

const users = new Map();
const server = http.Server(app);
const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/rooms', require('./routes/api/rooms'));
app.use('/api/games', require('./routes/api/games'));
app.use('/api/scores', require('./routes/api/scores'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


//authentication

async function authHandler(socket, next) {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
          return res.status(401).json({ msg: 'Token is not valid' });
        } else {
          const user = decoded.user;
          users.set(socket, {...user});
        }
        
    });

      
    } catch (error) {
      console.log(error);
    }
  }

  next();
}

io.use(authHandler);

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  socket.on('addRoom', (Room) => {
    Room = {...Room, creater: users.get(socket).id}
    roomController.createRoomBySocket(io, Room);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
