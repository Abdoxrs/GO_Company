const { ApiError } = require("./ApiError");

exports.permittedTo = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    next(new ApiError("you are not permitted to perform such action", 403));
  };
};
