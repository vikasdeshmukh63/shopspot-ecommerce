// importing modules
const express = require("express");
const { registerUser,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    getUserDetails, updatePassword,
    updateUserProfile,
    getAllUsers,
    getSingleUserDetails,
    updateUserRole,
    deleteUser } = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/authMiddleware");


// register route 
router.route("/register").post(registerUser);

// login route
router.route("/login").post(loginController);

//logout route
router.route("/logout").get(logoutController);

// forgot password route 
router.route("/password/forgot").post(forgotPasswordController);

//reset password route
router.route("/password/reset/:token").put(resetPasswordController)

// get user details route 
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// update user password controller 
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//update user profile
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

// get all user (admin)
router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("Admin"), getAllUsers);

// get single user details, update user role & delete user (admin)
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizedRoles("Admin"), getSingleUserDetails)
    .put(isAuthenticatedUser, authorizedRoles("Admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizedRoles("Admin"), deleteUser);



module.exports = router;