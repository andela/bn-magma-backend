import RequestService from '../services/RequestService';
import Responses from '../utils/Responses';
import Helper from '../utils/Helper';

/**
 * @class
 * @description A container class for all Request controllers
 * @exports RequestController
 */
export default class RequestController {
  /**
   * @method
   * @description Implements travel request endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof RequestController
   */
  static bookTrip(req, res) {
    const userId = req.user.id;
    const {
      origin, destination, departureDate, reason, accommodation, type, returnDate
    } = req.body;
    let request = {
      origin, destination, departureDate, reason, accommodation, userId, type, returnDate
    };
    request = Helper.formatRequest(request);
    RequestService.bookTrip(request).then(response => {
      Responses.setSuccess(201, 'travel request booked successfully', response);
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }

  /**
   * @method
   * @description Implements get all user requests endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof RequestController
   */
  static userTripRequests(req, res) {
    RequestService.userTripRequests(req.user.id)
      .then(userTrips => {
        if (userTrips.length === 0) {
          Responses.setError(404, 'You are yet to book a make a trip request');
          return Responses.send(res);
        }
        Responses.setSuccess(200, 'Trip requests retrieved successfully', userTrips);
        return Responses.send(res);
      });
  }
}
