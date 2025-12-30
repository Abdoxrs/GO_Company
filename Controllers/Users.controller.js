import asyncHandler from '../utilities/asyncHandler.js';
import * as userService from '../Services/users.service.js';
import ApiError from '../utilities/ApiError.js';

const CreateUser = asyncHandler(async (req, res, next) => {
  const NewUser = await userService.SignupUser(req.body);
  NewUser.password = undefined;
  NewUser.passwordConfirmation = undefined;
  res.status(201).json({
    status: "success",
    message: "user created successfully",
    data: NewUser
  });
});

const Login = asyncHandler(async (req, res, next) => {
  const token = await userService.LoginUser(req.body);
  res.status(200).json({
    status: "success",
    message: "User Logged in successfully",
    data: { token },
  });
});

const FindUser = asyncHandler(async (req, res, next) => {
  const TheOne = await userService.getUserById(req.params.id);
  if (!TheOne) throw new ApiError('User not found', 404);
  res.status(200).json({
    status: "success",
    message: "User Found!!",
    data: TheOne
  });
});

export { CreateUser, Login, FindUser };