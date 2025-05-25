import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import socketHandler from './routes/socketHandler.js';

dotenv.config();

const port = 8080;
const url = process.env.MONGODB_URI;

async function connectDB() {
    try {
        console.log('>>> Connecting to DB...');
        await mongoose.connect(url);
        console.log('>>> DB connected...');
    } catch (error) {
        console.error('!! Unable to connect to DB:', error.message);
        process.exit(1);
    }
}

async function startServer() {
    await connectDB();

    const server = http.createServer(app);
    socketHandler(server);

    server.listen(port, () => {
        console.log(`>>> HTTP + WebSocket server running on port ${port}`);
    });
}

startServer();
