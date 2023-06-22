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

// const server = http.Server(app);
// const io = socket(server);
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
