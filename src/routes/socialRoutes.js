/* eslint-disable no-unused-vars */
import express from 'express';
import passport from 'passport';

import Helper from '../utils/Helper';

const socialRouter = express.Router();

const addSocketIdtoSession = (req, res, next) => {
  req.data = {
    ...req.data,
    socketId: req.query.socketId,
  };
  next();
};

const callback = async (req, res, provider) => {
  const io = req.app.get('io');
  const { user } = req;
  const {
    id, email,
  } = user;

  // Generate Authentication Token
  const token = Helper.generateToken({ id, email });
  // Emit User Data to the frontend
  if (req.data && req.data.sessionId) io.in(req.data.socketId).emit(provider, { ...user, token });

  res.status(200).send({
    status: 'success',
    message: 'Login Successful',
    data: { ...user, token }
  });
};

socialRouter.get('/users/google', addSocketIdtoSession, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile'] }));
socialRouter.get('/users/google/callback', passport.authenticate('google'), (req, res) => callback(req, res, 'google'));

socialRouter.get('/users/facebook', addSocketIdtoSession, passport.authenticate('facebook', {
  scope: ['email']
}));
socialRouter.get('/users/facebook/callback', passport.authenticate('facebook'), (req, res) => callback(req, res, 'facebook'));

export default socialRouter;
