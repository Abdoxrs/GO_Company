import * as userService from '../Services/users.service.js';

const CreateUser = async (req, res, next) => {
  const NewUser = await userService.SignupUser(req.body);
  NewUser.password = undefined;
  NewUser.passwordConfirmation = undefined;
  res.status(201).json({
    status: "seccess",
    Message: "user created successfully",
    data: NewUser
  })
}

const Login = async (req, res, next) => {
  const token = await userService.LoginUser(req.body);
  res.status(200).json({
    status: "success",
    message: "User Logged in successfully",
    data: { token },
  });
}

const FindUser = async (req, res, next) => {
  const TheOne = await userService.getUserById(req.params.id)
  res.status(200).json({
    status: "Success",
    message: "User Found!!",
    data: TheOne
  })
}


export {CreateUser, Login, FindUser};