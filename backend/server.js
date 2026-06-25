require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require('./middleware/uploadMiddleware');
const { protect, architect } = require('./middleware/authMiddleware');
const { uploadPortfolioProject } = require('./controllers/architectController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Image Upload Route (Single Profile Pic)
app.post('/api/upload', protect, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

// Portfolio Upload Route (Multiple Images)
app.post('/api/architect/portfolio/upload', protect, architect, upload.array('images', 5), uploadPortfolioProject);

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/architect', require('./routes/architectRoutes'));
app.use('/api/client', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('WellDrafted Backend API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
