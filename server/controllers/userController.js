// importing modules
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");



//! register controller 
const registerUser = catchAsyncErrors(async (req, res, next) => {

    // cloudinary setup 
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    })

    // extracting data from body 
    const { name, email, password } = req.body;

    // checking the user is already present or not
    const existingUser = await User.findOne({ email });

    // if user is already present 
    if (existingUser) {
        return next(new ErrorHandler("User already present", 200));
    }

    // if user is new user then creating new user 
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id, // sending public id from cloudinary 
            url: myCloud.secure_url       // sending image url from cloudinary
        }
    });

    // generating and sending token 
    sendToken(user, 201, res, "User registered successfully");
});


//! login controller 
const loginController = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    // checking if user has given email and password both 
    if (!email || !password) {
        return next(new ErrorHandler("Please provide Email and Password", 400));
    }

    // finding user 
    const user = await User.findOne({ email }).select("+password");

    // if user not found 
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 200));
    }

    // if user is present in database then check for password match
    const isPasswordMatched = await user.comparePassword(password);

    // if password not match
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 200));
    }

    // if password match generating and sending token 
    sendToken(user, 200, res, "User logged in successfully");
});


//! logout controller
const logoutController = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).send({
        message: "User logged out successfully",
        success: true
    });

});


//! forgot password controller 
const forgotPasswordController = catchAsyncErrors(async (req, res, next) => {
console.log(req.body)
    // finding user 
    const user = await User.findOne({ email: req.body.email });

    //if user does not exist
    if (!user) {
        return next(new ErrorHandler("User not found", 200));
    }

    // get reset password token 
    const resetToken = user.getResetPasswordToken();

    // saving the passwordResetToken
    await user.save({ validateBeforeSave: false });

    // creating the resetPassword url 
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    // creating password reset message 
    const message = `your password reset token is :- \n\n${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopSpot",
            message
        });

        // after successfully sending the email 
        res.status(200).send({
            message: `Email sent to ${user.email} successfully.`,
            success: true
        });

    } catch (error) {
        // if any error occured then making resetPasswordToken & resetPasswordExpire undefined
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // saving the changes in user 
        await user.save({ validateBeforeSave: false });
    }

});


//! reset password controller 
const resetPasswordController = catchAsyncErrors(async (req, res, next) => {

    // hashing the token we get from client to compare it with the hash saved in database i.e.resetPasswordToken
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    // finding user based on the resetPasswordToken & expiry time of token 
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    // if user not found 
    if (!user) {
        return next(new ErrorHandler("Reset Password token is Invalid or has been Expired", 200));
    }

    // if user found then check for matching of password and confirm password
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 200));
    }

    // if matched then setting up new password
    user.password = req.body.password;

    // after setting new password setting resetPasswordToken & resetPasswordExpire to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined

    // saving user 
    await user.save();

    // after changing password sending token so that user get access to logged in features 
    sendToken(user, 200, res, "Password change and user logged in successfully")
});


//! get user details 
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    // finding user by id 
    const user = await User.findById(req.user.id);

    res.status(200).send({
        message: "User fetched successfully",
        success: true,
        user
    });
});


//! update user password controller
const updatePassword = catchAsyncErrors(async (req, res, next) => {

    // searching user based on the id 
    const user = await User.findById(req.user.id).select("+password");

    // checking that for the password match with the password in database
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    // if password does not match
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is Invalid", 200));
    }

    // checking for the newPassword and confirm password match 
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("new & old password not matched",200));
    }

    // if all conditions are true then setting the password
    user.password = req.body.newPassword;

    // saving the user changes
    await user.save();

    sendToken(user, 200, res, "Password is updated and user is logged in");
});


//! update user profile 
const updateUserProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // cloudinary operation
    if(req.body.avatar !== ""){
        // finding user 
        const user = await User.findById(req.user.id);
        // getting img id from that user 
        const imageId = user.avatar.public_id;
        // deleting the previous image by id from cloudinary
        await cloudinary.v2.uploader.destroy(imageId);
        // uploading new image 
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        })

        // saving new public id and avatar url to newUserData object 
        newUserData.avatar = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }

    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).send({
        message: "User Profile updated",
        success: true
    });
});


//! get all users (admin)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {

    // getting all the users 
    const users = await User.find();

    res.status(200).send({
        message: "Users data fetched successfully",
        success: true,
        users
    });
});


//! get single user details (admin)
const getSingleUserDetails = catchAsyncErrors(async (req, res, next) => {

    // finding user from his id which we get from params 
    const user = await User.findById(req.params.id);

    // if user not found 
    if (!user) {
        return next(new ErrorHandler(`user does not exist with id:${req.params.id}`, 404));
    }

    res.status(200).send({
        message: "User Details fetched successfully",
        success: true,
        user
    });

});


//!update user role controller (admin)
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    // finding user by his id and updating user role 
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).send({
        message: "role updated successfully",
        success: true,
    });
});


//!delete user from database (admin)
const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    // we will remove cloudinary later 

    // if user is not present 
    if (!user) {
        return next(new ErrorHandler(`user does not exist with id:${req.params.id}`, 400));
    }

    // if user is present then delete the user
    await user.deleteOne();         //.remove() will not work according to latest docs we need to use deleteOne()

    res.status(200).send({
        message: "User Deleted successfully",
        success: true
    });
})


module.exports = {
    registerUser,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    getUserDetails,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getSingleUserDetails,
    updateUserRole,
    deleteUser
}