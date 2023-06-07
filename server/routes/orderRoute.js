// importing modules
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router()
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

// new order route 
router.route("/order/new").post(isAuthenticatedUser,newOrder);

// get single orders route 
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);

// get all orders route 
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

// get all orders of product which are added by admin 
router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("Admin"),getAllOrders);

// update order route & delete order
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedRoles("Admin"),updateOrder).delete(isAuthenticatedUser,authorizedRoles("Admin"),deleteOrder);

module.exports = router;