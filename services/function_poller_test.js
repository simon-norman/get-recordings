
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

  beforeEach(() => {
    dataReturnedByFunction = 'data';
    stubbedFunction = sinon.stub();
    stubbedFunction.returns(dataReturnedByFunction);

    functionPollerConfig = {
      functionToPoll: stubbedFunction,
      functionResultEventName: 'resultEventName',
      pollingIntervalInMilSecs: 200,
    };

    FunctionPollerStamp = FunctionPollerStampFactory(EventEmittableStamp);
    functionPoller = FunctionPollerStamp();
  });

  describe('Register function with poller and receive events with result of function', function () {
    it('should receive events with the result of the function every X seconds, where X is the polling interval specified', function (done) {
      this.timeout(700);
      const resultsFromFunction = [];
      functionPoller.on(functionPollerConfig.functionResultEventName, (functionResult) => {
        resultsFromFunction.push(functionResult);
      });

      functionPoller.pollFunction(functionPollerConfig);


      setTimeout(() => {
        expect(resultsFromFunction.length).to.equal(2);
        expect(resultsFromFunction[0]).to.equal(dataReturnedByFunction);
        done();
      }, 500);
    });
  });

  describe('Throw errors when config values not specified', function () {
    it('should throw typeerror if event name for function result not specified', function () {
      functionPollerConfig.functionResultEventName = '';
      const wrappedFunctionPoller = () => {
        functionPoller.pollFunction(functionPollerConfig);
      };

      expect(wrappedFunctionPoller).throw(TypeError);
    });

    it('should throw typeerror if no function specified to poll', function () {
      functionPollerConfig.functionToPoll = '';
      const wrappedFunctionPoller = () => {
        functionPoller.pollFunction(functionPollerConfig);
      };

      expect(wrappedFunctionPoller).throw(TypeError);
    });

    it('should throw typeerror if polling interval not specified', function () {
      functionPollerConfig.pollingIntervalInMilSecs = '';
      const wrappedFunctionPoller = () => {
        functionPoller.pollFunction(functionPollerConfig);
      };

      expect(wrappedFunctionPoller).throw(TypeError);
    });

    it('should emit error event with details of the error if error is thrown when polling function', function (done) {
      this.timeout(500);
      stubbedFunction.throws();
      functionPoller.on('error', (error) => {
        expect(error).to.exist;
        done();
      });

      functionPoller.pollFunction(functionPollerConfig);
    });
  });
});

