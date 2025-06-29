import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

// Notifies the dev if their MONGO_URI is missing
if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let isConnected = 0; // Track the connection status

/** Used to ensure a database connection.
 * Connects to the database "TurfMania" using 
 * the MONGO_URI located in the .env.local file
 */
export const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }
    try {
        // Connect to the "TurfMania" database
        const db = await mongoose.connect(MONGO_URI, {
            dbName: 'TurfMania', // Database name
        });

        isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to the database');
    }
};