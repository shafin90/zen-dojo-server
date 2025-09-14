const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');
const paymentRoutes = require('./paymentRoutes');

// Use route modules
router.use('/', userRoutes);
router.use('/', classRoutes);
router.use('/', paymentRoutes);

// Health check route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Zen Dojo Server is running!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
