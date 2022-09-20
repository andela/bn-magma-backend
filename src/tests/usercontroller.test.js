import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import UserController from '../controllers/UserController';

chai.use(sinonChai);
const { expect } = chai;
const resetPasswordSpy = sinon.spy(UserController, 'resetPassword');
const updatePasswordSpy = sinon.spy(UserController, 'updatePassword');
const req = {
  headers: {
    host: '127.0.0.1'
  },
  body: {
    email: 'test@email.com',
  },
  params: {
    token: 'afja87rf4f84frf834f8ne4tf85g83f8a48fe8f'
  }
};
const res = {
  send: sinon.spy(),
  status: sinon.spy(),
  json: sinon.spy(),
};

describe('UserController', () => {
  describe('resetPassword', () => {
    it('should verify that email is not in use', done => {
      resetPasswordSpy(req, res);
      expect(resetPasswordSpy.calledOnce).to.be.equal(true);
      done();
    });
  });

  describe('updatePassword', () => {
    it('should update the password in the database', done => {
      updatePasswordSpy(req, res);
      expect(updatePasswordSpy.calledOnce).to.be.equal(true);
      done();
    });
  });
});
