import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Helper from '../utils/Helper';
import UserService from '../services/UserService';

chai.use(chaiHttp);

const { expect } = chai;
let token;

let userToken;
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

  it('should create a new user if details are valid', done => {
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        firstName: 'Viola',
        lastName: 'Violin',
        email: 'viola10@gmail.com',
        password: 'Viola100'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body).to.have.property('message')
          .eql('Kindly confirm the link sent to your email account to complete your registration');
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
        email: 'viola10@gmail.com',
        password: 'Viola100'
      })
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
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

describe('Profile Settings Routes', () => {
  before(done => {
    chai.request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'mathyr@gmail.com',
        password: 'viola100L'
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        done(err);
      });
  });
  describe('/PATCH Profile Settings route', () => {
    it('should return an error if parameter is not an email', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyrgmail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Vio9la',
          lastName: 'Vi8olin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08123465471'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    it('should return an error if wrong entries for birthDate field', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyr@gmail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: 'hjhj',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08181384092'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    it('should return an error if wrong entires for phoneNumber field', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyr@gmail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08123asoa'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    it('should return an error if wrong entires for gender field', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyr@gmail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'fcgh',
          phoneNumber: '08181384092'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    it('should return success if user is authenticated and all inputs are correct', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyr@gmail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08181384092'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('success');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    
    it('should return error if authenticated user is not the owner of profile', (done) => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/tosin@mail.com')
        .set('authorization', userToken)
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08181384092'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message')
            .eql('You are not allowed to edit this profile');
          done(err);
        });
    });
    it('should return an error if user is not authenticated', done => {
      chai
        .request(app)
        .patch('/api/v1/users/profile/mathyr@gmail.com')
        .send({
          firstName: 'Viola',
          lastName: 'Violin',
          birthDate: '1980-06-25',
          preferredLanguage: 'English',
          department: 'Administration',
          address: '22,juwon adedokun street',
          lineManager: 'Pius',
          gender: 'Male',
          phoneNumber: '08123465471'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
  });
  describe('/GET Profile Settings Route', () => {
    it('should return success if user is authenticated', done => {
      chai
        .request(app)
        .get('/api/v1/users/profile/mathyr@gmail.com')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('success');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });


    it('should return error if user is not authenticated', done => {
      chai
        .request(app)
        .get('/api/v1/users/profile/mathyr@gmail.com')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message');
          done(err);
        });
    });
    it('should return error if not user is the owner of the profile', done => {
      chai
        .request(app)
        .get('/api/v1/users/profile/tosin@mail.com')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('error');
          expect(res.body).to.have.property('message')
          .eql('You are not allowed to see this profile');
          done(err);
        });
    });
  });
});
