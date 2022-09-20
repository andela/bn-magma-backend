import models from '../database/models';
import Helper from '../utils/Helper';


const { User } = models;

/**
 * @class
 * @description A class containing all services
 * @exports UserService
 */
export default class UserService {
  /**
   * @method signup
   * @description Medium between the database and UserController
   * @static
   * @param {object} userCredentials - data object
   * @returns {object} JSON response
   * @memberof UserService
   */
  static async signup(userCredentials) {
    let {
      firstName, lastName, email, password
    } = userCredentials;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();
    password = await Helper.hashPassword(password);
    const user = {
      firstName, lastName, email, password
    };
    return User.create(user);
  }

  /**
   * @method signin
   * @description Signs in user with valid credentials
   * @static
   * @param {object} loginCredentials - data object
   * @returns {object} JSON response
   * @memberof UserService
   */
  static async signin(loginCredentials) {
    let { email } = loginCredentials;
    email = email.trim().toLowerCase();
    const foundUser = await User.findOne({ where: { email } });
    const user = {
      id: foundUser.id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName
    };
    return user;
  }

  /**
   * @method resetPassword
   * @description Signs in user with valid credentials
   * @static
   * @param {string} password
   * @param {string} email
   * @returns {object} JSON response
   * @memberof UserService
   */
  static async resetPassword(password, email) {
    const newPassword = await Helper.hashPassword(password);
    return User.update({ password: newPassword }, {
      where: { email },
      returning: true,
      plain: true,
    });
  }

  /**
   * @method findUser
   * @description Medium between the database and UserController
   * @static
   * @param {object} id - data number
   * @returns {object} JSON response
   * @memberof UserService
  */
  static async findUser(id) {
    const user = await User.findByPk(id);
    return user;
  }

  /**
   * @method updateUser
   * @description Medium between the database and UserController
   * @static
   * @param {object} email - data number
   * @returns {object} JSON response
   * @memberof UserService
  */
  static updateUser(email) {
    User.update(
      { isVerified: true },
      { where: { email } }
    );
  }
}
