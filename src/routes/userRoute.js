import express from 'express';
import UserController from '../controllers/UserController';
import validation from '../middlewares/validation';
import userValidations from '../middlewares/userValidations';
import Auth from '../middlewares/Auth';

const userRoute = express.Router();
const { validate, validateEmail } = validation;

userRoute.post(
  '/users/signup',
  validation.validate('signup'),
  userValidations.emailExists,
  UserController.signup
);

userRoute.post(
  '/users/signin',
  validation.validate('signin'),
  userValidations.validateLogin,
  UserController.signin
);

userRoute.get(
  '/users/verifyEmail/:token',
  UserController.verifyUserEmail
);

userRoute.get(
  '/users/profile/:email',
  validateEmail('emailParam'),
  Auth.userAuth,
  UserController.retrieveUserProfile
);

userRoute.patch(
  '/users/profile/:email',
  validateEmail('emailParam'),
  validate('profile'),
  Auth.userAuth,
  UserController.updateUserProfile
);

export default userRoute;
