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

export default {
  signup: Joi.object().keys({
    firstName,
    lastName,
    email,
    password
  }),
  signin: Joi.object().keys({
    email: Joi.string().required().label('Email is required'),
    password: Joi.string().required().label('password is required')
  })
};
