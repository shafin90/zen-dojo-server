const cors = require('cors');
const bodyParser = require('body-parser');

// CORS configuration - Open for all origins
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: false, // Set to false when origin is '*'
    optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware setup
const setupMiddleware = (app) => {
    // CORS middleware
    app.use(cors(corsOptions));
    
    // Body parser middleware
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
    
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    });
};

module.exports = { setupMiddleware };
