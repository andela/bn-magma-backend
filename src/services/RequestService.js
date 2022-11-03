import models from '../database/models';

const { Request } = models;

/**
 * @class
 * @description A class containing all Request services
 * @exports UserService
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
   * @method editTrip
   * @description Medium between the database and travelRequest Controller
   * @static
   * @param {object} requestDetails - data object
   * @param {object} requestId - data object
   * @returns {object} JSON response
   * @memberof RequestService
   */
  static editTrip(requestDetails, requestId) {
    const updatedUser = Request.update({ ...requestDetails }, {
      where: { id: requestId }
    });
    return updatedUser;
  }
}
