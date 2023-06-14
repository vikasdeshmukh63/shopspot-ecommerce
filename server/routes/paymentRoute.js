const express = require("express");
const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/authMiddleware");
const {processPayment, sendStripeApiKey} = require("../controllers/paymentController");


// payment route 
router.route("/payment/process").post(isAuthenticatedUser,processPayment);

// route to send stripe api key 
router.route("/stripeapikey").get(isAuthenticatedUser,sendStripeApiKey);

module.exports = router;