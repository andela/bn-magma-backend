import Joi from '@hapi/joi';

const name = Joi.string().trim().required().regex(/^[A-Za-z]+$/)
  .min(3);

const firstName = name
  .label('firstname is required, must be alphabets only and have at least 3 characters');

const lastName = name
  .label('lastname is required, must be alphabets only and have at least 3 characters');

const email = Joi.string().trim().lowercase().email()
  .required()
  .label('email is required, and should follow this format: myemail@domain.com');

const password = Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/)
  .label('password is required, must be at least 8 characters and must'
    + ' contain at least a number, one lowercase and one uppercase alphabet');

const required = Joi.string().trim().required();
const str = Joi.string().allow('');
const date = Joi.date().iso();
const reason = str.label('reason must be a string');
const accommodation = str.label('accommodation must be a string');

export default {
  signup: Joi.object().keys({
    firstName,
    lastName,
    email,
    password
  }),
  signin: Joi.object().keys({
    email,
    password: Joi.string().required().label('password is required')
  }),
  request: Joi.object().keys({
    origin: required.label('origin is required'),
    destination: required.label('destination is required'),
    type: required.valid('one-way', 'return', 'multi-city')
      .label('type is required and can only be "one-way", "return" or "multi-city"'),
    departureDate: date.required()
      .label('departureDate is required and must follow this format: YYYY-MM-DD'),
    returnDate: date.when('type', {
      is: 'return', then: date.min(Joi.ref('departureDate')).required()
    })
      .concat(date.when('type', { is: 'one-way', then: date.allow('') }))
      .label('returnDate is required for a "return" trip,'
        + ' it cannot come before departureDate'
        + ' and must follow this format: YYYY-MM-DD'),
    reason,
    accommodation
  }),
  childRequest: Joi.array().items(Joi.object().keys({
    destination: required.label('destination is required in childRequests'),
    departureDate: date.required()
      .label('departureDate is required in childRequests and must follow this format: YYYY-MM-DD'),
    reason,
    accommodation
  }))
};
