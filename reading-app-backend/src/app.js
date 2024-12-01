const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/stories', storyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});