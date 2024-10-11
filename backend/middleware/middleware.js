// middleware.js
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import winston from 'winston'

// Morgan Middleware for HTTP Request Logging
export const morganMiddleware = morgan('combined')

// Helmet Middleware for Security
export const helmetMiddleware = helmet()

// Rate Limiting Middleware
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true,
})

// Winston Logger Configuration
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Log errors to error.log
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Log all other logs to combined.log
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

// If not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }))
}
