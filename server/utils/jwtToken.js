// creating token and saving it in cookie
const sendToken = (user, statusCode, res,message) => {
    const token = user.getJwtToken();

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    // sending cookie 
    res.status(statusCode).cookie("token",token,options).send({
        message:message,
        success:true,
        token,
        user
    });
}

module.exports = sendToken;