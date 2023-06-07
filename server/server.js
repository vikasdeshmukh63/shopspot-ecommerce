// importing modules
const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");
const cloudinary = require("cloudinary");

// handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Err:${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1);
});

// config
dotenv.config();

// connecting database
connectDB();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

// creating server 
const server = app.listen(process.env.PORT,()=>{
    console.log(`server has started on http://localhost:${process.env.PORT}`);
});


// unhandled promise rejection 
process.on("unhandledRejection",(err)=>{
    console.log(`Err:${err.message}`);
    console.log("shutting down server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1)
    });

});
