import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;

let userToken;
let requestId;

describe('/POST Requests route', () => {
  before(done => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send({
        email: 'tosin@mail.com',
        password: 'Password1',
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        done(err);
      });
  });

  it('should return an error if user is not authenticated', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', '')
      .send({
        origin: 'Lagos  ',
        destination: '  London  ',
        type: 'one-way',
        departureDate: '2019-10-11',
        reason: '   dgfgfg      hfhfhf       kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message')
          .eql('You are not logged in');
        done(err);
      });
  });

  it('should return an error if token cannot be authenticated', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', 'urgjrigriirkjwUHJFRFFJrgfr')
      .send({
        origin: 'Lagos  ',
        destination: '  London  ',
        type: 'one-way',
        departureDate: '2019-10-11',
        returnDate: '2019/11/10',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message')
          .eql('Authentication failed');
        done(err);
      });
  });

  it('should return an error if request details are invalid', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        origin: '',
        destination: '  London  ',
        type: 'one-wy',
        departureDate: '2019/160/11',
        returnDate: '2029/22/33',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message');
        done(err);
      });
  });

  it('should return an error if one-way trip has return date', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        origin: 'Lagos',
        destination: '  London  ',
        type: 'one-way',
        departureDate: '2019-10-11',
        returnDate: '2019-11-11',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message')
          .eql('you cannot have returnDate for a one-way trip');
        done(err);
      });
  });

  it('should return an error if departure date has gone already', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        origin: 'Lagos',
        destination: '  London  ',
        type: 'one-way',
        departureDate: '2019-08-11',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message')
          .eql('you cannot go back in time');
        done(err);
      });
  });

  it('should book a trip if details are valid', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        origin: 'Lagos  ',
        destination: '  London  ',
        type: 'return',
        departureDate: '2019-10-11',
        returnDate: '2019-11-11',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.have.property('origin');
        expect(res.body.data).to.have.property('returnDate');
        expect(res.body).to.have.property('message')
          .eql('travel request booked successfully');
        done(err);
      });
  });

  it('should return an error if a requester already has a trip booked for that period', done => {
    chai
      .request(app)
      .post('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        origin: 'Lagos  ',
        destination: '  London  ',
        type: 'return',
        departureDate: '2019-10-11',
        returnDate: '2019-11-11',
        reason: '   dgfgfg      hfhfhf        kfkfkf   ',
        accommodation: '   bbbv   '
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message')
          .eql('you already have a trip booked around this period, '
          + 'you may choose to cancel and make a multi-city request');
        done(err);
      });
  });
  it('should cancel request successfully', done => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}`)
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.equal(201);
        expect(res.status).to.be.a('number');
        expect(body).to.be.an('object');
        expect(body).to.have.property('message')
        .eql('Request successfully cancelled!');
        done();
    });
  });
  it('should return an error if the request Id is not a number', done => {
    chai
      .request(app)
      .delete(`/api/v1/requests/n`)
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
       const { body } = res;
          expect(res.status).to.be.a('number');
          expect(body).to.be.an('object');
          expect(body).to.have.property('message')
          done();
    });
  });
  it('should return an error if the requester is not the owner of the request', done => {
    chai
      .request(app)
      .delete(`/api/v1/requests/${requestId}`)
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.equal(400);
        expect(res.status).to.be.a('number');
        expect(body).to.be.an('object');
        expect(body).to.have.property('message');
        done();
    });
  });
  it('should return an error if request is not found', (done) => {
    chai
    .request(app)
    .delete(`/api/v1/requests/78`)
    .set('authorization', `Bearer ${userToken}`)
    .end((err, res) => {
     const { body } = res;
     expect(res.status).to.equal(404);
     expect(res.status).to.be.a('number');
     expect(body).to.be.an('object');
     expect(body).to.have.property('message')
     .eql('Request does not exist');
     done();
      });
    });
});
