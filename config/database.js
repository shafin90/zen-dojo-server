const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        console.log("Connecting to MongoDB...");
        console.log(process.env.MONGODB_URI);
        try {
            const uri = process.env.MONGODB_URI || "mongodb+srv://mashrafiahnam:IOwrG4DoOlIGCD3G@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority";
            
            // Mongoose connection options
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                bufferCommands: false, // Disable mongoose buffering
            };

            this.connection = await mongoose.connect(uri, options);
            
            console.log("Successfully connected to MongoDB with Mongoose!");
            console.log(`Database: ${this.connection.connection.name}`);
            console.log(`Host: ${this.connection.connection.host}`);
            
            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('Mongoose connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('Mongoose disconnected from MongoDB');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('Mongoose reconnected to MongoDB');
            });

            return this;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.connection) {
                await mongoose.connection.close();
                console.log('Database connection closed');
            }
        } catch (error) {
            console.error('Error closing database connection:', error);
            throw error;
        }
    }

    getConnection() {
        return this.connection;
    }

    // Health check method
    async healthCheck() {
        try {
            const state = mongoose.connection.readyState;
            const states = {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            };
            
            return {
                status: states[state],
                readyState: state,
                host: mongoose.connection.host,
                name: mongoose.connection.name
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    }
}

// Create singleton instance
const database = new Database();

module.exports = database;
