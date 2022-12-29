const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const { cToken } = req.cookies
  console.log("cToken",cToken);
  if (cToken) {
    try {
      jwt.verify(cToken, process.env.JWT_SECRET);
    } catch (error) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }
  } else {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (error) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }
    next();
  };
};
