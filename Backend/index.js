const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Router = require('./router');
const AuthRouter = require('./auth/authrouter');
const checkAuth = require('./auth/authmiddleware');
const hashtagRouter = require('./Hashtag/hashtagroute');
const db = require('./database');  // Assuming this is your single Sequelize instance
require('./association');  // Import associations if needed

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', "PUT"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));  // Enable CORS for your Express routes

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'public');
app.use('/public', express.static(publicPath));

// Routes
app.use("/api/posts", checkAuth, Router);
app.use("/api/auth", AuthRouter);
app.use("/api/hashtag", checkAuth, hashtagRouter);

// Create HTTP server and pass it to both Express and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomId, userId }) => {
        console.log(`User ${userId} joining room ${roomId}`);
        socket.join(roomId);

        // if (isAuthorized(roomId, userId)) {
        //     socket.emit('message', 'Welcome to the chat room!');
        // } else {
        //     socket.leave(roomId);
        //     socket.emit('message', 'You are not authorized to join this room.');
        // }
    });

    socket.on('chatMessage', ({ roomId, message }) => {
        io.to(roomId).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

function isAuthorized(roomId, userId) {
    const [userId1, userId2] = roomId.split('_');
    return userId === userId1 || userId === userId2;
}

// Sync database and start server
db.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(console.error);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
