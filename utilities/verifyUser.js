const jwt = require("jsonwebtoken");
const { getUserById } = require("../Services/users.service");
const { ApiError } = require("./ApiError");
module.exports = async (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  console.log(bearerToken);
  if (!bearerToken)
    throw new ApiError("you are not logged in, please login to continue", 401);
  const token = bearerToken.split("Bearer ")[1];
  const payload = jwt.verify(token, "this-is-my-very-long-secret");
  const user = await getUserById(payload.id);
  req.user = user;
  next();
};