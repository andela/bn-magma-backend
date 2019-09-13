import chai from 'chai';
import sinon from 'sinon';
import sendEmail from '../utils/mailer';

const { expect } = chai;
const data = {
  recipientEmail: 'teamemail@magma.com',
  subject: 'verify test',
  body: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
};

describe('Verification mail sending', () => {
  it('calls callback function when user is signing up', done => {
    const transport = { sendMail: (textData, cb) => cb() };
    const sendEmailSpy = sinon.spy(sendEmail);
    sendEmailSpy(transport, data);
    expect(sendEmailSpy).to.have.property('calledOnce').eql(true);
    expect(data).to.be.an('object');
    done();
  }).timeout(10000);
});
