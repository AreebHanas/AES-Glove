import app from './app.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const port = 8080

const url = process.env.MONGODB_URI
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

    app.listen(port, () => {
        console.log(`>>> App listening on port: ${port}`);
    });
}

startServer();