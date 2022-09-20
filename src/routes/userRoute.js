import express from 'express';
import UserController from '../controllers/UserController';
import validation from '../middlewares/validation';
import userValidations from '../middlewares/userValidations';

const userRoute = express.Router();

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

userRoute
  .post('/users/reset', UserController.resetPassword)
  .get('/users/reset/:token', UserController.updatePassword)
  .patch(
    '/users/reset/:token',
    validation.validate('updatePassword'),
    UserController.updatePassword
  );

userRoute.get(
  '/users/verifyEmail/:token',
  UserController.verifyUserEmail
);

export default userRoute;
