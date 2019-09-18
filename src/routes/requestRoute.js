import express from 'express';
import RequestController from '../controllers/RequestController';
import validation from '../middlewares/validation';
import requestValidations from '../middlewares/requestValidations';
import Auth from '../middlewares/Auth';


const { userAuth } = Auth;
const { validateTrip, validateTripRequest } = requestValidations;
const { bookTrip, userTripRequests, managerAvailRequests } = RequestController;

const requestRoute = express.Router();

requestRoute.post(
  '/requests',
  Auth.userAuth,
  validation.validate('request'),
  validation.validateChildRequests,
  requestValidations.validateChildRequest,
  requestValidations.validateTrip,
  requestValidations.validateTripRequest,
  RequestController.bookTrip
);

requestRoute.get(
  '/requests',
  Auth.userAuth,
  userTripRequests
);

requestRoute.get(
  'manager/requests',
  Auth.userAuth,
  managerAvailRequests
);
export default requestRoute;
