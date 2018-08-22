
const { expect } = require('chai');
const sinon = require('sinon');

const FunctionPollerStampFactory = require('./function_poller.js');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');


describe('function_poller', function () {
  let dataReturnedByFunction;
  let stubbedFunction;
  let functionPollerConfig;
  let FunctionPollerStamp;
  let functionPoller;

  const wrappedFunctionPollerInstantiate = () => {
    functionPoller = FunctionPollerStamp(functionPollerConfig);
  };

  beforeEach(() => {
    dataReturnedByFunction = 'data';
    stubbedFunction = sinon.stub();
    stubbedFunction.returns(dataReturnedByFunction);

    functionPollerConfig = {
      functionToPoll: stubbedFunction,
      functionResultEventName: 'resultEventName',
      pollingIntervalInMilSecs: 100,
    };

    FunctionPollerStamp = FunctionPollerStampFactory(EventEmittableStamp);
    functionPoller = FunctionPollerStamp(functionPollerConfig);
  });

  describe('Register function with poller, which sends events with result of function', function () {
    it('should send events with the result of the function every X seconds, where X is the polling interval specified', function (done) {
      const resultsFromFunction = [];
      functionPoller.on(functionPollerConfig.functionResultEventName, (functionResult) => {
        resultsFromFunction.push(functionResult);
      });

      functionPoller.pollFunction();


      setTimeout(() => {
        expect(resultsFromFunction.length).to.equal(2);
        expect(resultsFromFunction[0]).to.equal(dataReturnedByFunction);
        done();
      }, 250);
    });
  });

  describe('Throw errors when config values not specified', function () {
    it('should throw typeerror if event name for function result not specified', function () {
      functionPollerConfig.functionResultEventName = '';

      expect(wrappedFunctionPollerInstantiate).throw(TypeError);
    });

    it('should throw typeerror if no function specified to poll', function () {
      functionPollerConfig.functionToPoll = '';

      expect(wrappedFunctionPollerInstantiate).throw(TypeError);
    });

    it('should throw typeerror if polling interval not specified', function () {
      functionPollerConfig.pollingIntervalInMilSecs = '';

      expect(wrappedFunctionPollerInstantiate).throw(TypeError);
    });

    it('should emit error event with details of the error if error is thrown when polling function', function () {
      stubbedFunction.throws();

      const functionPollerErrors = [];
      functionPoller.on('error', (error) => {
        functionPollerErrors.push(error);
      });
      functionPoller.pollFunction();

      setTimeout(() => {
        expect(functionPollerErrors.length).to.equal(2);
      }, 250);
    });
  });
});

