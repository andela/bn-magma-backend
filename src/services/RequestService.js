import models from '../database/models';

const { Request, ChildRequest } = models;

/**
 * @class
 * @description A class containing all Request services
 * @exports RequestService
 */
export default class RequestService {
  /**
   * @method bookTrip
   * @description Medium between the database and travelRequest Controller
   * @static
   * @param {object} requestDetails - data object
   * @returns {object} JSON response
   * @memberof RequestService
   */
  static bookTrip(requestDetails) {
    return Request.create(requestDetails);
  }

  /**
   * @method multiCity
   * @method requests
   * @description Medium between the database and travelRequest Controller
   * @static
   * @param {object} requestDetails - data object
   * @returns {object} JSON response
   * @memberof RequestService
   */
  static multiCity(requestDetails) {
    return ChildRequest.bulkCreate(requestDetails, { returning: true });
  }

  /**
   * @method requests
   * @description Medium between the database and travelRequest Controller
   * @static
   * @param {object} requestDetails - data object
   * @returns {object} JSON response
   * @memberof RequestService
   */
  static userTripRequests(requestDetails) {
    return Request.findAll({ where: { userId:requestDetails } });
  }

  /**
   * @method requests
   * @description Medium between the database and travelRequest Controller
   * @static
   * @param {object} requestDetails - data object
   * @returns {object} JSON response
   * @memberof RequestService
   */
  static managerAvailRequests(requestDetails) {
    // return Request.findAll({ where: { lineManager:requestDetails.id, status:'open' } });
    const requests = Request.findAll({ 
      where: { lineManager:requestDetails.id, status:'open' }, 
      include: [{model: ChildRequest}]
    });
    return requests
  }
}
