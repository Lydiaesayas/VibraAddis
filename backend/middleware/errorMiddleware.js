const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message;

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Check for Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};
