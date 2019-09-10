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

export default {
  signup: Joi.object().keys({
    firstName,
    lastName,
    email,
    password
  }),
  request: Joi.object().keys({
    origin: required.label('origin is required'),
    destination: required.label('destination is required'),
    type: required.valid('one-way')
      .label('type is required and can only be "one-way"'),
    departureDate: Joi.date().iso().required()
      .label('departureDate is required and must follow this format: YYYY-MM-DD'),
    reason: str.label('reason must be a string'),
    accommodation: str.label('accommodation must be a string')
  })
};
