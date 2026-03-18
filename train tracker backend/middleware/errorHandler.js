/**
 * Central error handler middleware.
 * Must be registered after all routes in Express.
 */
function errorHandler(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.isOperational
        ? err.message
        : 'An unexpected error occurred. Please try again later.';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { errorHandler, AppError };
