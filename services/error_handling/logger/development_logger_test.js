
const { expect } = require('chai');
const sinon = require('sinon');
const { logException, wrapperToHandleUnhandledExceptions } = require('./development_logger.js');

describe('development_logger', () => {
  let consoleLogSpy;
  let mockError;

  before(() => {
    mockError = new Error('error');
    consoleLogSpy = sinon.spy(console, 'log');
  });

  beforeEach(() => {
    consoleLogSpy.resetHistory();
  });

  it('should log any unhandled exceptions to the console', function () {
    wrapperToHandleUnhandledExceptions(() => {
      throw mockError;
    });

    expect(consoleLogSpy.calledOnceWithExactly(mockError)).to.equal(true);
  });

  it('should log exceptions to the console', function () {
    logException(mockError);

    expect(consoleLogSpy.calledOnceWithExactly(mockError)).to.equal(true);
  });
});

