const sinon = require('sinon');

const stubGetAccuwareRecordings = (accuwareApiWithConfig) => {
  const getAccuwareRecordingsStub = sinon.stub(accuwareApiWithConfig.accuwareApi, 'get');

  getAccuwareRecordingsStub.withArgs(
    `/sites/${accuwareApiWithConfig.siteId}/stations/`,
    {
      lrrt: accuwareApiWithConfig.intervalPeriodInSeconds,
      includeLocations: 'yes',
      devicesToInclude: 'all',
      areas: 'yes',
    }
  ).returns(Promise.resolve(accuwareApiWithConfig.unconvertedRecordings));

  return getAccuwareRecordingsStub;
};


module.exports = stubGetAccuwareRecordings;
