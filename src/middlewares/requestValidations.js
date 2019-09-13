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
    if (messages) {
      Responses.setError(409, 'you already have a trip booked around this period');
      return Responses.send(res);
    }
    next();
  }).catch(() => {
    Responses.setError(500, 'database error');
    return Responses.send(res);
  });
};

/**
   * @function isGoneDate
   * @description Checks if departure date has gone by
   * @static
   * @param {object} travelDate - The departure date
   * @returns {object} Boolean response
   */
const isGoneDate = travelDate => {
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  now = now.toISOString();
  if (travelDate < now) return true;
  return false;
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
  if ((type === 'one-way' || type === 'multi-city') && returnDate) {
    Responses.setError(400, 'you cannot have returnDate for a "one-way" or "multi-city" trip');
    return Responses.send(res);
  }
  if (isGoneDate(departureDate)) {
    Responses.setError(400, 'you cannot go back in time');
    return Responses.send(res);
  }
  next();
};

/**
   * @function validateChildRequest
   * @description Validates childRequest field of a multi-city trip
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @returns {object} JSON response
   */
const validateChildRequest = (req, res, next) => {
  const { type, childRequests } = req.body;
  const mainDate = req.body.departureDate;
  if (type === 'multi-city' && childRequests) {
    const errors = [];
    childRequests.forEach((childRequest, index) => {
      const { departureDate } = childRequest;
      const prevDate = index === 0 ? mainDate : childRequests[index - 1].departureDate;
      const trip = index + 2;
      if (departureDate < prevDate) {
        errors.push(`Trip ${trip}'s departureDate cannot come before trip ${trip - 1}'s`);
      }
    });
    if (errors.length > 0) {
      Responses.setError(400, errors);
      return Responses.send(res);
    }
  }
  next();
};

export default { validateTripRequest, validateTrip, validateChildRequest };
