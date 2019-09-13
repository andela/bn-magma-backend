import express from 'express';
import RequestController from '../controllers/RequestController';
import validation from '../middlewares/validation';
import requestValidations from '../middlewares/requestValidations';
import Auth from '../middlewares/Auth';

const { userAuth } = Auth;
const { validateTrip, validateTripRequest } = requestValidations;
const { bookTrip, userTripRequests } = RequestController;

const requestRoute = express.Router();

requestRoute.post(
  '/requests',
  userAuth,
  validation.validate('request'),
  validateTrip,
  validateTripRequest,
  bookTrip
);

requestRoute.get(
  '/requests',
  Auth.userAuth,
  userTripRequests
);

export default requestRoute;
