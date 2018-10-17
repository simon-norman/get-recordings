const sinon = require('sinon');

const stubGetAccuwareRecordings = (accuwareApiWithConfig) => {
  const getAccuwareRecordingsStub = sinon.stub(accuwareApiWithConfig.accuwareApi, 'get');

  getAccuwareRecordingsStub.withArgs().returns(Promise.resolve(accuwareApiWithConfig.unconvertedRecordings));

  return getAccuwareRecordingsStub;
};


module.exports = stubGetAccuwareRecordings;
