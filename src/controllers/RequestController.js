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
   * @description Implements edit travel request endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof RequestController
   */
  static editTrip(req, res) {
    const requestId = req.params.id;
    const requestDetails = req.body;
    Helper.formatRequest(requestDetails);
    RequestService.editTrip(requestDetails, requestId).then(response => {
      Responses.setSuccess(200, 'travel request updated successfully', response);
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }
}
