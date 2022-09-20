import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import app from '../index';
import Helper from '../utils/Helper';
import UserService from '../services/UserService';

chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;
let token;

describe('/POST Signup route', () => {
  it('should return an error if user credentials are invalid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Vio9la',
        lastName: 'Vi8olin',
        email: 'viola10gmail.com',
        password: 'viola100'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error if email already exists', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Jibson',
        lastName: 'Onyekelu',
        email: 'naimatdavid@mail.com',
        password: 'Adeyemo100'
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message').eql('email already in use');
        done(err);
      });
  });

  it('should not create a new user if details are invalid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Vio9la',
        lastName: 'Vi8olin',
        email: 'viola10gmail.com',
        password: 'viola100'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should  create a new user if details are valid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'tunde',
        lastName: 'awati',
        email: 'nano@gmail.com',
        password: 'David20@$',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body).to.have.property('message')
          .eql('Kindly confirm the link sent to your email account to complete your registration');
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error if email already exists', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Jibson',
        lastName: 'Onyekelu',
        email: 'naimatdavid@mail.com',
        password: 'Adeyemo100'
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message').eql('email already in use');
        done(err);
      });
  });
});

describe('/POST Signin route', () => {
  it('should return an error if user credentials are invalid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'viola10gmail.com',
        password: 'viola100'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error if login email is not found', done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'viola102@gmail.com',
        password: 'viola10012'
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message').eql('Your email cannot be found in our database.');
        done(err);
      });
  });

  it('should return an error if password is incorrect', done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'frank@gmail.com',
        password: 'Viola10012345',
      })
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message').eql('Your password is incorrect.');
        done(err);
      });
  });

  it('should return an error if email is not verified', done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'nano@gmail.com',
        password: 'David20@$'
      })
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body.message).to.be.equal('Your email is not verified.');
        expect(res.status).to.be.equal(401);
        done(err);
      });
  });

  it('should sign in a registered user if details are valid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'frank123@gmail.com',
        password: 'Password12345',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body).to.have.property('message')
          .eql('Login successful.');
        done(err);
      });
  });
});

describe('/users/verifyEmail/:token', () => {
  before(done => {
    token = Helper.generateToken({ id: 1, email: 'naimatdavid@mail.com' });
    done();
  });
  it('should update isVerified column to true', done => {
    chai
      .request(app)
      .get(`/api/v1/users/verifyEmail/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  }).timeout(5000);

  it('should return error if token is not provided', done => {
    chai
      .request(app)
      .get('/api/v1/users/verifyEmail')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('status').eql('error');
        done();
      });
  }).timeout(5000);

  it('should return user object if account id is provided', done => {
    UserService.findUser(1).then(user => {
      expect(user).to.be.an('object');
      expect(user).to.have.property('dataValues');
    }).finally(done);
  });

  it('shoul return null if id is not provided', done => {
    UserService.findUser().then(user => {
      expect(user).to.be.a('null');
    }).finally(done);
  });
});
describe('POST api/v1/users/reset', () => {
  it('should send a registered user a reset password link', done => {
    chai
      .request(app)
      .post('/api/v1/users/reset')
      .send({
        email: 'frank123@gmail.com'
      })
      .end((err, res) => {
        expect(res).to.haveOwnProperty('status');
        done();
      });
  });

  it('should send an appropriate message if password reset link is  sent ', done => {
    chai
      .request(app)
      .post('/api/v1/users/reset')
      .send({
        email: 'frank123@gmail.com'
      })
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty('message');
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});


describe('POST api/v1/users/reset/:token', () => {
  before(done => {
    token = Helper.generateToken({ email: 'naimatdavid@mail.com', issued: Date.now(), expiryDate: Date.now() + 36000 });
    done();
  });
  it('should update a user password', done => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${token}`)
      .send({ password: 'Lorem20@$' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  }).timeout(5000);
  it('should take the user to a page to reset the password', done => {
    chai
      .request(app)
      .get(`/api/v1/users/reset/${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('should validate the new password', done => {
    before(() => {
      token = Helper.generateToken({
        email: 'naimatdavid@mail.com',
        issued: Date.now(),
        expiryDate: 3600000
      });
    });
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${token}`)
      .send({ password: 'morem20' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  }).timeout(5000);
  it('should not update password via an expired link', done => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${Helper.generateToken({ email: 'naimatdavid@mail.com', issued: Date.now(), expiryDate: 3600000 })}`)
      .send({ password: 'Morem20@$' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('this address link has expired');
        done();
      });
  }).timeout(5000);
});

describe('/users/verifyEmail/:token', () => {
  before(done => {
    token = Helper.generateToken({ id: 1, email: 'naimatdavid@mail.com' });
    done();
  });
  it('should update isVerified column to true', done => {
    chai
      .request(app)
      .get(`/api/v1/users/verifyEmail/${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  }).timeout(10000);

  it('should return error if token is not provided', done => {
    chai
      .request(app)
      .get('/api/v1/users/verifyEmail')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('status').eql('error');
        done();
      });
  }).timeout(5000);

  it('should return user object if account id is provided', done => {
    UserService.findUser(1).then(user => {
      expect(user).to.be.an('object');
      expect(user).to.have.property('dataValues');
    }).finally(done);
  });

  it('shoul return null if id is not provided', done => {
    UserService.findUser().then(user => {
      expect(user).to.be.a('null');
    }).finally(done);
  });
});

describe('POST api/v1/users/reset', () => {
  it('should send a registered user a reset password link', done => {
    chai
      .request(app)
      .post('/api/v1/users/reset')
      .send({
        email: 'frank123@gmail.com'
      })
      .end((err, res) => {
        expect(res).to.haveOwnProperty('status');
        done();
      });
  });

  it('should send an appropriate message if password reset link is  sent ', done => {
    chai
      .request(app)
      .post('/api/v1/users/reset')
      .send({
        email: 'frank123@gmail.com'
      })
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty('message');
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});


describe('POST api/v1/users/reset/:token', () => {
  before(done => {
    token = Helper.generateToken({ email: 'naimatdavid@mail.com', issued: Date.now(), expiryDate: Date.now() + 36000 });
    done();
  });
  it('should update a user password', done => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${Helper.generateToken({ email: 'naimatdavid@mail.com', expiryDate: parseInt(Date.now() + 36000, 10) })}`)
      .send({ password: 'Lorem20@$' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  }).timeout(5000);
  it('should take the user to a page to reset the password', done => {
    chai
      .request(app)
      .get(`/api/v1/users/reset/${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('should validate the new password', done => {
    before(() => {
      token = Helper.generateToken({
        email: 'naimatdavid@mail.com',
        issued: Date.now(),
        expiryDate: 3600000
      });
    });
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${token}`)
      .send({ password: 'morem20' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  }).timeout(5000);
  it('should not update password via an expired link', done => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset/${Helper.generateToken({ email: 'naimatdavid@mail.com', issued: Date.now(), expiryDate: 3600000 })}`)
      .send({ password: 'Morem20@$' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('this address link has expired');
        done();
      });
  }).timeout(5000);
});
