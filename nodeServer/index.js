import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import socketHandler from './routes/socketHandler.js'; // make sure this path is correct

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

    const server = http.createServer(app); // ⬅️ this is new
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    socketHandler(io); // ⬅️ plug in your socket logic

    server.listen(port, () => {
        console.log(`>>> Server with sockets listening on port: ${port}`);
    });
}

startServer();
