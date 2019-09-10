import express from 'express';
import RequestController from '../controllers/RequestController';
import validation from '../middlewares/validation';
import requestValidations from '../middlewares/requestValidations';
import Auth from '../middlewares/Auth';

const requestRoute = express.Router();

requestRoute.post('/requests',
  Auth.userAuth,
  validation.validate('request'),
  requestValidations.validateDeparture,
  RequestController.bookTrip);

export default requestRoute;
