const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    // wrong mongodb id error 
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is Invalid, Try again";
        err = new ErrorHandler(message, 400);
    }

    //json web token expire error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is Expired, Try again";
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).send({
        message: err.message,
        success: false,
    });
}