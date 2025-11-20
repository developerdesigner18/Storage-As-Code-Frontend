import winston from 'winston';
import config from '../config/config';

/**
 * Winston logger configuration
 * Provides structured logging with multiple transports
 */
const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'pure-fusion-backend' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                    let msg = `${timestamp} [${level}]: ${message}`;
                    if (Object.keys(metadata).length > 0) {
                        msg += ` ${JSON.stringify(metadata)}`;
                    }
                    return msg;
                })
            ),
        }),
        // Write all logs to combined.log
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(winston.format.json()),
        }),
        // Write errors to error.log
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(winston.format.json()),
        }),
    ],
});

// Create a stream object for Morgan HTTP logger
export const logStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export default logger;
