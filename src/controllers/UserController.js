import UserService from '../services/UserService';
import Responses from '../utils/Responses';
import Helper from '../utils/Helper';
import sendEmail from '../utils/mailer';
import transporter from '../utils/transporter';

/**
 * @class
 * @description A container class for all controllers
 * @exports UserController
 */
export default class UserController {
  /**
   * @method
   * @description compose email verification
   * @static
   * @param {string} email
   * @param {string} host
   * @param {string} token - application url
   * @returns {object} object
  */
  static composeVerificationMail(email, host, token) {
    return {
      recipientEmail: `${email}`,
      subject: 'Email verification',
      body: `<a href='http://${host}/api/v1/users/verifyEmail/${token}'>Verify Your Email</a>`
    };
  }

  /**
   * @method
   * @description Implements signup endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof UserController
   */
  static signup(req, res) {
    const user = req.body;
    const msg = 'Kindly confirm the link sent to your email account to complete your registration';
    UserService.signup(user).then(response => {
      const result = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName
      };
      const { email } = result;
      const token = Helper.generateToken({ id: response.id, email, });
      const mailData = Helper.composeVerificationMail(req, email, token);
      sendEmail(transporter(), mailData);
      Responses.setSuccess(201, msg, { token, ...result });
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }

  /**
   * @method
   * @description Implements signin endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof UserController
   */
  static signin(req, res) {
    const loginCredentials = req.body;
    UserService.signin(loginCredentials).then(response => {
      const token = Helper.generateToken({ id: response.id, email: response.email });
      Responses.setSuccess(200, 'Login successful.', { token, ...response });
      return Responses.send(res);
    }).catch(() => {
      Responses.setError(500, 'database error');
      return Responses.send(res);
    });
  }

  /**
   * @method
   * @description Implements password reset endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof UserController
  */
  static async resetPassword(req, res) {
    const { email } = req.body;
    const emailOptions = Helper.constructResetEmail(req, email);
    const validUser = await Helper.verifyExistingEmail(email);
    if (validUser) {
      sendEmail(transporter(), emailOptions);
      Responses.setSuccess(200, 'a password reset link has been sent to your email');
      return Responses.send(res);
    }
    Responses.setError(400, 'there is no user with such email');
    return Responses.send(res);
  }

  /**
   * @method
   * @description Implements update password controller
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof UserController
   */
  static async updatePassword(req, res) {
    const { token } = req.params;
    const data = Helper.verifyToken(token);
    const hasExpired = data.expiryDate < Date.now();
    if (hasExpired) {
      Responses.setError(400, 'this address link has expired');
      return Responses.send(res);
    }
    if (req.method === 'GET') {
      Responses.setSuccess(200, 'enter your new email');
      return Responses.send(res);
    }
    const { password } = req.body;
    const user = await UserService.resetPassword(password, data.email);
    const {
      id, email, createdAt, updatedAt
    } = user[1];
    Responses.setSuccess(
      200,
      'successfully updated your password',
      {
        id, email, createdAt, updatedAt
      }
    );
    return Responses.send(res);
  }

  /**
   * @method
   * @description Email verification endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} JSON response
   * @memberof UserController
   */
  static async verifyUserEmail(req, res) {
    const { token } = req.params;
    const { id, email } = Helper.verifyToken(token);
    const user = await UserService.findUser(id);
    if (email === user.email) {
      UserService.updateUser(email);
    }
    Responses.setSuccess(200, 'Your account has been verified');
    return Responses.send(res);
  }
}
