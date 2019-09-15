import RequestService from '../services/RequestService';
import Responses from '../utils/Responses';
import Helper from '../utils/Helper';
import models from '../database/models';

const { Request, User } = models;

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
   * @description Implements cancel request endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof RequestController
   */
  static deleteTrip(req, res) {
    const { id } = req.params;
    Request.findOne({ 
      where: { 
        id: Number(id) 
      }, 
      include: [{
        model: User,
        as: 'requester',
      }]
      }).then(response => {
        return response.destroy();
      }).then(() => {
        Responses.setSuccess(201, 'Request has been deleted successfully');
        return Responses.send(res);
      }).catch((error) => {
        console.log(error);
        Responses.setError(500, 'database error');
        return Responses.send(res); 
  });
}

}
