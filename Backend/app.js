const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./util/db');
const passport = require('./middlewares/auth');
const cors = require('cors');
require('dotenv').config();


app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    
    cors: {
        // origin:'https://healthconnect-frontend.onrender.com', 
        origin: "*",
        credentials: true,
    }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-hospital-room", (hospitalId) => {
    socket.join(hospitalId);
    console.log(`Socket ${socket.id} joined room: ${hospitalId}`);
  });

  socket.on("leave-hospital-room", (hospitalId) => {
    socket.leave(hospitalId);
    console.log(`Socket ${socket.id} left room: ${hospitalId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

connectDB();

app.set('io', io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/v1/hospitals', require('./routes/hospitalRoutes'));
app.use('/v1/users', require('./routes/userRoutes'));
app.use('/v1/admin', require('./routes/adminRoutes'));
app.use('/v1/appointment', require('./routes/appointmentRoutes'));

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
