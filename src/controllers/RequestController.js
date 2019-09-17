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
      if (response.type === 'multi-city') {
        const { childRequests } = req.body;
        return RequestController.multiCity(childRequests, response, res);
      }
      Responses.setSuccess(201, 'travel request booked successfully', response);
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }

  /**
   * @method
   * @description Control multi-city requests
   * @static
   * @param {object} children
   * @param {object} data
   * @param {object} res
   * @returns {object} JSON response
   * @memberof RequestController
   */
  static multiCity(children, data, res) {
    let childRequests = children.map(child => ({
      destination: child.destination,
      departureDate: child.departureDate,
      reason: child.reason,
      accommodation: child.accommodation,
      requestId: data.id
    }));
    childRequests = childRequests.map(Helper.formatRequest);
    RequestService.multiCity(childRequests).then(response => {
      Responses.setSuccess(201, 'travel request booked successfully', [data, ...response]);
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }
}
