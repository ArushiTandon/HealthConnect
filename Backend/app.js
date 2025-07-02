const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./util/db');
const passport = require('./middlewares/auth');
const cors = require('cors');
require('dotenv').config();

connectDB();

app.use(cors({
    
    origin:'https://healthconnect-frontend.onrender.com', 
    credentials: true,
}));

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/v1/hospitals', require('./routes/hospitalRoutes'));
app.use('/v1/users', require('./routes/userRoutes'));
app.use('/v1/admin', require('./routes/adminRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})