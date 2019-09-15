import express from 'express';
import RequestController from '../controllers/RequestController';
import validation from '../middlewares/validation';
import requestValidations from '../middlewares/requestValidations';
import Auth from '../middlewares/Auth';

const { userAuth } = Auth;
const { validateTrip, validateTripRequest, validateDelete } = requestValidations;
const { bookTrip, deleteTrip } = RequestController;

const requestRoute = express.Router();

requestRoute.post(
  '/requests',
  userAuth,
  validation.validate('request'),
  validateTrip,
  validateTripRequest,
  bookTrip
);
requestRoute.delete(
  '/requests/:id',
  userAuth,
  validation.validateParam('id'),
  validateDelete,
  deleteTrip
);

export default requestRoute;
