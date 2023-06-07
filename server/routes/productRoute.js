// importing modules 
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReviews } = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router()

// get all products route 
router.route("/products").get(getAllProducts);

//create product
router.route("/admin/product/new").post(isAuthenticatedUser, authorizedRoles("Admin"), createProduct);

// update product & delete product
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizedRoles("Admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizedRoles("Admin"), deleteProduct)

// get product details 
router.route("/product/:id").get(getProductDetails);

// create product review 
router.route("/create-review").put(isAuthenticatedUser,createProductReview);

// get product reviews 
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteProductReviews);




module.exports = router;