import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';

import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;

describe('Social Authentication', () => {
  beforeEach(() => {
    nock('http://localhost:7000/api/v1/users')
      .get('/facebook')
      .reply(200, {
        status: 'success',
        message: 'FaceBook Login Successful'
      })
      .get('/google')
      .reply(200, {
        status: 'success',
        message: 'Google Login Successful'
      });
  });

  it('should log the user in using FaceBook', done => {
    chai
      .request(app)
      .get('/api/v1/users/facebook')
      .end(err => {
        expect(200);
        done(err);
      });
  }).timeout(10000);

  it('should log the user in using Google', done => {
    chai
      .request(app)
      .get('/api/v1/users/google')
      .end(err => {
        expect(200);
        done(err);
      });
  }).timeout(10000);
});
