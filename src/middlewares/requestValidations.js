import Responses from '../utils/Responses';
import models from '../database/models';
import Helper from '../utils/Helper';

/**
   * @function
   * @description Validates request body
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @returns {object} JSON response
   */
const validateTripRequest = (req, res, next) => {
  const userId = req.user.id;
  const { type } = req.body;
  let { departureDate, returnDate } = req.body;
  departureDate = new Date(departureDate).toISOString();
  if (type === 'return') returnDate = new Date(returnDate).toISOString();
  models.Request.findAll({ where: { userId } }).then(data => {
    if (data.length > 0) {
      const conflicts = Helper.checkTrip(data, departureDate, returnDate);
      return conflicts;
    }
  }).then(messages => {
    if (messages && messages.length > 0) {
      Responses.setError(409, 'you already have a trip booked around this pe'
        + 'riod, you may choose to cancel and make a multi-city request');
      return Responses.send(res);
    }
    next();
  }).catch(() => {
    Responses.setError(500, 'database error');
    return Responses.send(res);
  });
};

/**
   * @function
   * @description Validates trip dates
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @returns {object} JSON response
   */
const validateTrip = (req, res, next) => {
  const { type } = req.body;
  let { departureDate, returnDate } = req.body;
  departureDate = new Date(departureDate).toISOString();
  returnDate = returnDate ? returnDate.trim() : undefined;
  if (type === 'one-way' && returnDate) {
    Responses.setError(400, 'you cannot have returnDate for a one-way trip');
    return Responses.send(res);
  }
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  now = now.toISOString();
  if (departureDate < now) {
    Responses.setError(400, 'you cannot go back in time');
    return Responses.send(res);
  }
  next();
};

/**
   * @function
   * @description Validates open trip
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @returns {object} JSON response
   */
const validateOpenTrip = (req, res, next) => {
  const { id } = req.user;
  const requestId = req.params.id;
  if (!requestId) {
    Responses.setError(400, 'Error! Request id is empty!');
    return Responses.send(res);
  }
  models.Request.findOne({ where: { id: requestId } }).then(data => {
    if (!data) {
      Responses.setError(400, 'Request does not exist');
      return Responses.send(res);
    }
    if (id !== data.userId) {
      Responses.setError(400, 'You are not permitted to edit this request. Wrong user!');
      return Responses.send(res);
    }
    if (data.status !== 'open') {
      Responses.setError(405, 'Your trip cannot be edited. It is closed already!');
      return Responses.send(res);
    }
    next();
  });
};

export default { validateTripRequest, validateTrip, validateOpenTrip };
