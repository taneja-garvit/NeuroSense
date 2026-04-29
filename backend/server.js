require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const recommendationRoutes = require('./routes/recommendations');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NeuroSense API is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to NeuroSense API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            assessment: '/api/assessment',
            recommendations: '/api/recommendations',
            health: '/api/health'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║     NeuroSense API Server Running     ║
  ╠════════════════════════════════════════╣
  ║  Port: ${PORT}                            ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║  MongoDB: Connected                    ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
