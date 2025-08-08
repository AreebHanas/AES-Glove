import express from 'express'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import exerciseRoute from './routes/exerciseRoute.js'
import historyRoute from './routes/historyRoute.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express()
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
}));


app.use('/api',authRoute)
app.use('/api/user',userRoute)
app.use('/api/exercise',exerciseRoute)
app.use('/api/history',historyRoute)
app.use('/uploads/avatars', express.static('uploads/avatars'));

export default app;