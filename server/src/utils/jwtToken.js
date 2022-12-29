// Create Token and saving in cookie

const sendToken = (user, statusCode, res, remember) => {
  const rToken = user.getJWTToken(process.env.JWT_EXPIRE_REFRESH);
  const aToken = user.getJWTToken(process.env.JWT_EXPIRE_ACCESS);

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (remember)
    res.cookie("token", rToken, options);

  res.status(statusCode).json({
    success: true,
    user,
    aToken,
  });
};

module.exports = sendToken;
