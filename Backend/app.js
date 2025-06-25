const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./util/db');
const passport = require('./middlewares/auth');
require('dotenv').config();

connectDB();


app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/v1/hospitals', require('./routes/hospitalRoutes'));
app.use('/v1/users', require('./routes/userRoutes'));
app.use('/v1/admin', require('./routes/adminRoutes'));

app.listen(process.env.PORT, () => {
    console.log('Server is running on port');
})


// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWMyNjk1YWVhOWUxMmJlYWYwYTBlYSIsInVzZXJuYW1lIjoiYXBvbGxvQWRtaW4iLCJpYXQiOjE3NTA4NzA1NjAsImV4cCI6MTc1MDk1Njk2MH0.wZmPKLjswqrwvBZOIKKz1zZde5MPQWRiPAglQs6xmIg"