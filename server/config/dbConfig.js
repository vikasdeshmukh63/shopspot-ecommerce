// importing modules 
const mongoose = require("mongoose");

// connecting with database
function connectDB() {
     mongoose.connect(process.env.MONGO_URL);

    const db = mongoose.connection;

    // on connection
    db.on("connected", () => {
        console.log("connected to mongodb database");
    });

    // on error
    db.on("error", () => {
        console.log("database connection failed");
    });
}

module.exports = connectDB;

