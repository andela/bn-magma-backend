import express from 'express';
import RequestController from '../controllers/RequestController';
import validation from '../middlewares/validation';
import requestValidations from '../middlewares/requestValidations';
import Auth from '../middlewares/Auth';

const { userAuth } = Auth;
const { validateTrip, validateTripRequest, validateOpenTrip } = requestValidations;
const { bookTrip, editTrip } = RequestController;

const requestRoute = express.Router();

requestRoute.post(
  '/requests',
  userAuth,
  validation.validate('request'),
  validateTrip,
  validateTripRequest,
  bookTrip
);

requestRoute.patch(
  '/requests/:id',
  userAuth,
  validation.validate('request'),
  validateTrip,
  validateOpenTrip,
  editTrip
);

export default requestRoute;
