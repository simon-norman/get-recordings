
const { expect } = require('chai');
const Raven = require('raven');
const sinon = require('sinon');
const { logException } = require('./logger.js');

describe('logger', () => {
  const stubbedRavenCaptureException = sinon.stub(Raven, 'captureException');

  it('should log exceptions with Raven', async function () {
    const mockError = new Error('error');
    logException(mockError);

    expect(stubbedRavenCaptureException.calledOnceWithExactly(mockError)).to.equal(true);
  });
});

