
const { expect } = require('chai');
const sinon = require('sinon');

const FunctionPollerStamp = require('./function_poller.js');


describe('function_poller', () => {
  describe('Register function with poller and receive events with result of function', () => {
    it('should receive events with the result of the function every X seconds, where X is the polling interval specified', async () => {
      const dataReturnedByFunction = 'data';
      const stubbedFunction = sinon.stub();
      stubbedFunction.returns(dataReturnedByFunction);
      const functionPollerConfig = {
        functionToPoll: stubbedFunction,
        functionResultEventName: 'resultEventName',
        pollingIntervalInMilSecs: 1000,
      };

      const functionPoller = FunctionPollerStamp();

      const resultsFromFunction = [];
      functionPoller.pollFunction(functionPollerConfig)
        .on(functionPollerConfig.functionResultEventName, (functionResult) => {
          resultsFromFunction.push(functionResult);
        });

      await setTimeout(() => {
        expect(resultsFromFunction.length).to.equal(2);
        expect(resultsFromFunction[0]).to.equal(dataReturnedByFunction);
      }, 2500);
    });
  });
});

