import express from 'express'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
// import examRoute from './routes/examRoute.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express()
app.use(bodyParser.json());
app.use(cors());


app.use('/api',authRoute)
app.use('/api',userRoute)
// app.use('/api',examRoute)

export default app;