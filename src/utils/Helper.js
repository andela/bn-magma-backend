import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Responses from './Responses';

const secret = process.env.SECRET;

/**
 * @class Helper
 * @description An helper class containing utility methods
 * @exports Helper
 */
export default class Helper {
  /**
   * @method generateToken
   * @description Generates token for securing endpoints
   * @static
   * @param {object} payload - data object
   * @returns {object} JSON response
   * @memberof Helper
   */
  static generateToken(payload) {
    const token = jwt.sign(payload, secret, {
      expiresIn: '24hr',
    });
    return token;
  }

  /**
   * @method verifyToken
   * @description verify user token for authorization
   * @static
   * @param { string } token - sting
   * @returns {object} payload
   * @memberof Helper
  */
  static verifyToken(token) {
    const decoded = jwt.verify(token, secret);
    return decoded;
  }

  /**
   * @method hashPassword
   * @description Hash password before saving in the database
   * @static
   * @param {string} password - Password to be encrypted
   * @returns {string} string response
   * @memberof Helper
   */
  static async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  /**
   * @method buildErrorResponse
   * @description Set error response
   * @static
   * @param {object} data - Response from Joi validation
   * @returns {object} JSON response
   * @memberof Helper
   */
  static buildErrorResponse(data) {
    if (data.error) {
      const allErrors = data.error.details;
      const errors = this.getErrorLabels(allErrors);
      if (errors) {
        Responses.setError(400, errors);
      }
      return errors;
    }
    return null;
  }

  /**
   * @method getErrorLabels
   * @param {object} allErrs - Array containing all errors
   * @returns {object} JSON response
   * @memberof Helper
   */
  static getErrorLabels(allErrs) {
    const errors = [];
    allErrs.forEach(err => {
      const { context } = err;
      if (err.type !== 'object.allowUnknown' && context.key !== context.label) {
        if (!errors.includes(context.label)) errors.push(context.label);
      }
    });
    const errs = errors.length > 0 ? errors : null;
    return errs;
  }

  /**
   * @method comparePassword
   * @description compare password with database hash password
   * @static
   * @param {string} password - password from the request body
   * @param {string} hashPassword - encrypted password from database
   * @returns {string} string response
   * @memberof Helper
   */
  static comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * @method formatRequest
   * @param {object} request - Request body
   * @returns {object} JSON response
   * @memberof Helper
   */
  static formatRequest(request) {
    const {
      origin, destination, reason, accommodation, type, returnDate
    } = request;
    if (!returnDate) request.returnDate = undefined;
    request.origin = origin ? origin.trim() : undefined;
    request.destination = destination.trim();
    request.type = type ? type.trim() : undefined;
    request.reason = reason ? reason.trim().replace(/  +/g, ' ') : undefined;
    request.accommodation = accommodation ? accommodation.trim() : undefined;
    return request;
  }

  /**
   * @method noReturn
   * @param {object} depart - Departure date from the database
   * @param {object} travel - Departure date in the request body
   * @param {object} back - Return date in the request body
   * @returns {object} JSON response
   * @memberof Helper
   */
  static noReturn(depart, travel, back) {
    if (depart === travel || back === travel) return true;
    return false;
  }

  /**
   * @method withReturn
   * @param {object} travel - Departure date in the request body
   * @param {object} depart - Departure date from the database
   * @param {object} ret - Return date from the database
   * @param {object} back - Return date in the request body
   * @returns {object} JSON response
   * @memberof Helper
   */
  static withReturn(travel, depart, ret, back) {
    ret = ret.toISOString();
    const firstConflict = travel >= depart && travel <= ret;
    const secondConflict = back >= depart && back <= ret;
    const thirdConflict = depart > travel && depart < back;
    const fourthConflict = ret > travel && ret < back;
    const firstSecondConflict = firstConflict || secondConflict;
    const thirdFourthConflict = thirdConflict || fourthConflict;
    if (firstSecondConflict || thirdFourthConflict) return true;
    return false;
  }

  /**
   * @method checkTrip
   * @description Check for trip conflicts
   * @param {object} myRequests - Array of user's request
   * @param {object} travelDate - Departure date in the request body
   * @param {object} backDate - Return date in the request body
   * @returns {object} JSON response
   * @memberof Helper
   */
  static checkTrip(myRequests, travelDate, backDate = undefined) {
    const conflicts = [];
    let conflict;
    myRequests.forEach(request => {
      let { departureDate } = request;
      const { returnDate } = request;
      departureDate = departureDate.toISOString();
      if (!returnDate) {
        conflict = Helper.noReturn(departureDate, travelDate, backDate);
        conflicts.push(conflict);
      } else {
        conflict = Helper.withReturn(travelDate, departureDate, returnDate, backDate);
        conflicts.push(conflict);
      }
    });
    if (conflicts.includes(true)) return true;
    return false;
  }

  /**
   * @method getRequestFormat
   * @description return 404 if no request is found
   * @param {object} myRequests - Array of user's request
   * @param {object} travelDate - Departure date in the request body
   * @param {object} backDate - Return date in the request body
   * @returns {object} JSON response
   * @memberof Helper
   */
  static getRequestFormat(requests, res) {
    if (requests.length === 0) {
      Responses.setError(404, 'There are no trip requests presently');
      return Responses;
    }
    Responses.setSuccess(200, 'Trip requests retrieved successfully', requests);
    return Responses;
  }

}
