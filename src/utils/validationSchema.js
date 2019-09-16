import Joi from '@hapi/joi';

const name = Joi.string().trim().min(3).regex(/^[A-Za-z]+$/)
  .required();
const otherUserFields = Joi.string().trim().allow(null, '');

const email = Joi.string().trim().lowercase().email()
  .required()
  .label('email is required, and should follow this format: myemail@domain.com');

const password = Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/)
  .label('password is required, must be at least 8 characters and must'
    + ' contain at least a number, one lowercase and one uppercase alphabet');

const required = Joi.string().trim().required();
const str = Joi.string().allow('');
const date = Joi.date().iso();

export default {
  signup: Joi.object().keys({
    firstName: name
      .label('firstName is required, must be alphabets only and have at least 3 characters'),
    lastName: name
      .label('lastName is required, must be alphabets only and have at least 3 characters'),
    email,
    password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/)
      .label('password is required, must be at least 8 characters and must'
      + ' contain at least a number, one lowercase and one uppercase alphabet')
  }),
  signin: Joi.object().keys({
    email,
    password: Joi.string().required().label('password is required')
  }),
  emailParam: Joi.object().keys({
    email,
  }),
  profile: Joi.object().keys({
    firstName: name
      .label('firstName is required, must be alphabets only and have at least 3 characters'),
    lastName: name
      .label('lastName is required, must be alphabets only and have at least 3 characters'),
    birthDate: Joi.date().iso().allow(null, '')
      .label('date, must be in this format YYYY-MM-DD'),
    preferredLanguage: otherUserFields
      .label('preffered language can be English, French,..etc'),
    gender: Joi.any().valid(['Male', 'Female', 'Other']).allow(null, '')
      .label('gender can be either Male, Female or Other'),
    address: otherUserFields.label('address is required'),
    department: otherUserFields.label('please specify your current department'),
    lineManager: otherUserFields.label('please specify your current line manager'),
    role: otherUserFields.label('please specify your roles'),
    phoneNumber: otherUserFields.regex(/^[0-9]{10,14}$/)
      .label('please only enter a valid phone number'),
  }),
  request: Joi.object().keys({
    origin: required.label('origin is required'),
    destination: required.label('destination is required'),
    type: required.valid('one-way', 'return')
      .label('type is required and can either be "one-way" or "return"'),
    departureDate: date.required()
      .label('departureDate is required and must follow this format: YYYY-MM-DD'),
    returnDate: date.when('type', {
      is: 'return', then: date.min(Joi.ref('departureDate')).required()
    })
      .concat(date.when('type', { is: 'one-way', then: date.allow('') }))
      .label('returnDate is required for a "return" trip,'
      + ' it cannot come before departureDate'
      + ' and must follow this format: YYYY-MM-DD'),
    reason: str.label('reason must be a string'),
    accommodation: str.label('accommodation must be a string')
  })
};
