// importing modules
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


//create product controller --Admin
const createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id; //because we are not passing user id or any info from frontend but we want it otherwise the schema validation will fail hence we are sending the if from here

    const product = await Product.create(req.body);

    res.status(201).send({
        message: "Product created successfully",
        success: true,
        product
    });
});


// get all products
const getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage); // for adding search feature ApiFeatures(query,queryStr);

    const products = await apiFeatures.query;

    res.status(201).send({
        message: "All products fetched successfully",
        success: true,
        productCount,
        products,
        resultPerPage
    });
})


// update product 
const updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).send({
        message: "Product successfully updated",
        product
    });

    return next(new ErrorHandler());
});


// delete product 
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        await product.deleteOne(); //.remove() will not work according to latest docs we need to use deleteOne()

        res.status(200).send({
            message: "Product deleted successfully",
            success: true
        });
    } catch (error) {
        return next(new ErrorHandler());
    }
});


// get product details 
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).send({
            message: "Product fetch successfully",
            success: true,
            product
        });
    } catch (error) {
        return next(new ErrorHandler());
    }
});


// create new review or update the existing review 
const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;


    // creating review object 
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    // finding the product from productId
    const product = await Product.findById(productId);

    // if product not found 
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // checking that product is already review or not 
    const isReviewed = product.reviews.find((item) => {
        if (item.user.toString() === req.user._id.toString()) {
            return true;
        } else {
            return false;
        }
    });


    // if item is reviewed by user then edit it 
    if (isReviewed) {
        product.reviews.forEach((item) => {
            if (item.user.toString() === req.user._id.toString()) {
                item.rating = rating;
                item.comment = comment;
            }
        });
    }
    //if item is not reviewed by user then add review also setting up no. of reviews
    else {
        product.reviews.push(review);
        product.noOfReviews = product.reviews.length;
    }


    // setting up average product rating 
    let avg = 0;
    product.reviews.forEach((item) => {
        avg += item.rating;
    });

    product.ratings = avg / product.reviews.length;

    //saving the product
    await product.save({ validateBeforeSave: false });

    res.status(200).send({
        message: "review added",
        success: true
    });
});


// get all reviews of a single product 
const getProductReviews = catchAsyncErrors(async (req, res, next) => {

    // finding product by id 
    const product = await Product.findById(req.query.productId);

    // if product not found
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // if product found then sending it to client 
    res.status(200).send({
        message: "Product reviews fetched successfully",
        success: true,
        review: product.reviews
    });
});

// delete product review controller 
const deleteProductReviews = catchAsyncErrors(async (req, res, next) => {

    // finding product by id 
    const product = await Product.findById(req.query.productId);

    // if product not found
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // filtering review based on id and saving which id is different from the review we want to delete 
    const reviews = product.reviews.filter((item) => {
        return item._id.toString() !== req.query.id.toString();
    });

    // setting up updated average rating
    let avg = 0;
    reviews.forEach((item) => {
        avg += item.rating;
    });

    const ratings = avg / reviews.length;

    // setting up no. of reviews 
    const noOfReviews = reviews.length;

    // updating product changes
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        noOfReviews
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).send({
        message:"Review deleted",
        success:true
    });
});

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteProductReviews
}