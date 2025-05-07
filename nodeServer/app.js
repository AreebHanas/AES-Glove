import express from 'express'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import exerciseRoute from './routes/exerciseRoute.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express()
app.use(bodyParser.json());
app.use(cors());


app.use('/api',authRoute)
app.use('/api/user',userRoute)
app.use('/api/exercise',exerciseRoute)

export default app;