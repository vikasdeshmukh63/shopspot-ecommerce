// importing modules 
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// creating new order 
const newOrder = catchAsyncErrors(async (req, res, next) => {

    // receiving data from client in variables 
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;


    // creating new order 
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    // sending order to client 
    res.status(201).send({
        message: "Order Placed",
        success: true,
        order
    });
});


// get single order 
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    // finding order from id received from params 
    const order = await Order.findById(req.params.id).populate("user", "name email"); // when we use populate then insted of getting users id we will get the users name & email from users collection.

    // if order is not present in database 
    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    // if order found then sending it to client 
    res.status(200).send({
        message: "Order fetched successfully",
        success: true,
        order
    });
});


// get all orders of logged in user 
const myOrders = catchAsyncErrors(async (req, res, next) => {

    // finding respective user orders from users id 
    const orders = await Order.find({ user: req.user._id });

    // sending orders to client 
    res.status(200).send({
        message: "Orders fetched successfully",
        success: true,
        orders
    });
});


// get all orders (admin)
const getAllOrders = catchAsyncErrors(async (req, res, next) => {

    // finding all orders 
    const orders = await Order.find();


    // calculating total amount that seller will get from all orders 
    let totalAmount = 0;

    orders.forEach((item) => {
        totalAmount += item.totalPrice;
    });

    // sending all orders and totalAmount to client 
    res.status(200).send({
        message: "Orders fetched successfully",
        success: true,
        totalAmount,
        orders
    });
});


// update order status 
const updateOrder = catchAsyncErrors(async (req, res, next) => {
    // finding respective order 
    const order = await Order.findOne({ _id: req.params.id });

    // if order not found 
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    // if order is already delivered 
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    // when order is delivered then we need to minus the order quantity from stock
    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    // updating order status
    order.orderStatus = req.body.status;

    // if order is delivered then only set the deliveredAt date 
    if (order.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).send({
        message: "Order status updated",
        success: true
    });
});


// function for modifying the stock of the product according to the orders 
async function updateStock(productId, productQuantity) {

    // finding the product from its id 
    const product = await Product.findById(productId);

    // setting stock of the product 
    product.stock -= productQuantity;

    // saving changes in product 
    await product.save({ validateBeforeSave: false })
}


// delete order route (admin)
const deleteOrder = catchAsyncErrors(async (req, res, next) => {

    // finding the order
    const order = await Order.findOne({ _id: req.params.id });

    // if order not found 
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    // deleting the respective order
    await order.deleteOne();

    res.status(200).send({
        message: "Order deleted successfully",
        status: true,
    });

});


module.exports = {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}