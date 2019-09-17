import Joi from '@hapi/joi';
import _ from 'lodash';
import Schemas from '../utils/validationSchema';
import Responses from '../utils/Responses';
import Helper from '../utils/Helper';

/**
 * @function
 * @description Validates user credentials
 * @param {object} path - The signup schema
 * @returns {object} JSON response
 */
const validate = path => (req, res, next) => {
  const user = req.body;
  if (_.has(Schemas, path)) {
    const schema = _.get(Schemas, path);
    const response = Joi.validate(user, schema, { abortEarly: false });
    const errors = Helper.buildErrorResponse(response);
    if (errors) return Responses.send(res);
  }
  next();
};

const validateChildRequests = (req, res, next) => {
  const { childRequests, type } = req.body;
  let errorMessages;
  if (childRequests && type === 'multi-city') {
    const result = Joi.validate(
      childRequests,
      (_.get(Schemas, 'childRequest')), { abortEarly: false }
    );
    errorMessages = Helper.buildErrorResponse(result);
    if (errorMessages) {
      return Responses.send(res);
    }
  }
  next();
};

export default { validate, validateChildRequests };
