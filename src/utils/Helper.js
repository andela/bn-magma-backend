import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import models from '../database/models';
import Responses from './Responses';

dotenv.config();

const secret = process.env.SECRET;
const senderEmail = process.env.EMAIL;
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
      expiresIn: '1hr',
    });
    return token;
  }

  /**
   * @method verifyToken
   * @description verify user's token for authorization
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
  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  /**
    * @method verifyExistingEmail
    * @description verify if an email already exists
    * @static
    * @param {string} email string
    * @returns {boolean} true or false
    * @memberof Helper
    */
  static async verifyExistingEmail(email) {
    const check = await models.User.findOne({ where: { email, isVerified: true } });
    if (check) {
      return true;
    }
    return false;
  }

  /**
   * @method
   * @description compose email verification
   * @static
   * @param {object} req
   * @param {string} email
   * @param {string} token - jwt token
   * @returns {object} object
  */
  static composeVerificationMail(req, email, token) {
    const recipients = [email];
    const { host } = req.headers;
    return {
      from: `"Magma Talent Team"<${senderEmail}>`,
      to: [...recipients],
      subject: 'Email verification',
      html: `<a href='http://${host}/api/v1/users/verifyEmail/${token}'>Verify Your Email</a>`
    };
  }

  /**
    * @method constructResetEmail
    * @description construct a password rest email
    * @static
    * @param {object} req object,
    * @param {string} email string,
    * @returns {object} constructed object
    * @memberof Helper
    */
  static constructResetEmail(req, email) {
    const recipients = [email];
    const issued = Date.now();
    const expiryDate = parseInt(Date.now(), 10) + 3600000;
    const payload = { email, issued, expiryDate };
    const token = Helper.generateToken(payload);
    const link = `http://${req.headers.host}/api/v1/users/reset/${token}`;
    const text = `
           <h2>Hi, there</h2>
           <p>you can reset your password <a href='${link}'>here</a></p>
    `;
    return {
      from: `barefootnomad.com <${process.env.GMAIL_ADDRESS}>`,
      to: [...recipients],
      subject: 'Barefoot Nomad Password Reset Link',
      html: text
    };
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
    request.origin = origin.trim();
    request.destination = destination.trim();
    request.type = type.trim();
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
    const conflicts = [];
    if (depart === travel || back === travel) {
      conflicts.push(depart);
    }
    return conflicts;
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
    const conflicts = [];
    ret = ret.toISOString();
    const firstConflict = travel >= depart && travel <= ret;
    const secondConflict = back >= depart && back <= ret;
    const thirdConflict = depart > travel && depart < back;
    const fourthConflict = ret > travel && ret < back;
    const firstSecondConflict = firstConflict || secondConflict;
    const thirdFourthConflict = thirdConflict || fourthConflict;
    if (firstSecondConflict || thirdFourthConflict) conflicts.push(depart);
    return conflicts;
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
    let conflicts;
    myRequests.forEach(request => {
      let { departureDate } = request;
      const { returnDate } = request;
      departureDate = departureDate.toISOString();
      if (!returnDate) conflicts = Helper.noReturn(departureDate, travelDate, backDate);
      else conflicts = Helper.withReturn(travelDate, departureDate, returnDate, backDate);
    });
    if (conflicts) return conflicts;
    return null;
  }
}
