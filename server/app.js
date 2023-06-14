// importing modules
const express = require("express");
const app = express();
var cors = require("cors");
const errorMiddleware = require("./middleware/errorHandlerMiddleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// importing routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");

// using middlewares
app.use(express.json());
app.use(cookieParser()); // for accessing the cookies from request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// CORS configuration
const corsOptions = {
  origin: true, // this is true so that we can request from any origin if we want to restrict the access to specific origin we can provide the origin link or if the origins are multiple then we can also provide an array of origin links
  credentials: true,
};
app.use(cors(corsOptions));

// using routes
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1",paymentRoute);

// using error middleware
app.use(errorMiddleware);

module.exports = app;
