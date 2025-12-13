
const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileRoutes = require('./routes/fileRoutes');


const app = express();

// Middleware — must come first
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/files', fileRoutes);

app.get('/', (req, res) => {
    res.render('index');
});


// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes — after middleware
const homeRoutes = require('./routes/homeRoutes');
app.use('/home', homeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
