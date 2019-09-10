import models from '../database/models';
import Responses from '../utils/Responses';

/**
 * @function
 * @description Check if email is already exists
 * @param {object} req - Resquest object
 * @param {object} res - Response object
 * @param {object} next
 * @returns {object} JSON response
 */
const emailExists = (req, res, next) => {
  let { email } = req.body;
  email = email.trim().toLowerCase();
  models.User.findOne({ where: { email } }).then(data => {
    if (data) {
      Responses.setError(409, 'email already in use');
      return Responses.send(res);
    }
    next();
  }).catch(() => {
    Responses.setError(500, 'database error');
    return Responses.send(res);
  });
};

export default { emailExists };
