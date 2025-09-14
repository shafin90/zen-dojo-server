require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Import modules
const database = require('./config/database');
const { setupMiddleware } = require('./middleware');
const routes = require('./routes');

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use('/', routes);

// Start server
async function startServer() {
    try {
        // Connect to database
        await database.connect();
        
        // Start listening
        app.listen(port, () => {
            console.log(`Zen Dojo Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await database.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await database.close();
    process.exit(0);
});

// Start the server
startServer();