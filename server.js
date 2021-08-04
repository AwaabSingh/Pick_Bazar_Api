import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'
import xss from 'xss-clean'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit';
import hpp from 'hpp'
import cors from 'cors'
import connectDB from './config/db.js'
import {  notFound, errorHandler} from './middleware/error.js'

// Routes files
import products from './routes/productRoutes.js'
import users from './routes/userRoutes.js'
import order from './routes/orderRoute.js'

const app = express()

// Connect DB
connectDB();

// Body Parser
app.use(express.json())

// Api Security
// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins 
    max: 100
})

app.use(limiter)

// Prevent http para
app.use(hpp())

// Enable CORS
app.use(cors());


dotenv.config({ path: './config/config.env'})

// Mount routers

app.use('/api/v1/products', products)
app.use('/api/v1/users', users)
app.use('/api/v1/orders', order)

// Error Handler
app.use(notFound)
app.use(errorHandler)

// morgan var
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running on ${PORT}`.bgMagenta))