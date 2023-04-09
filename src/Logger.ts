import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'site-smoke-test.log' }),
  ],
});

/**
 * Configuration for logging the output to the console
 */
export const consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
});

export default logger;
