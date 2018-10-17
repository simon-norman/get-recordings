const sinon = require('sinon');
const testingConfig = require('./testing_config');

const setUpStubbedApis = (apisToStub) => {
  const stubbedAccuwareApi = sinon.stub(apisToStub.accuwareApi, 'get');
  stubbedAccuwareApi.returns(Promise.resolve('some data'));

  const stubbedRecordingsApi = sinon.stub(apisToStub.recordingApi, 'post').withArgs(testingConfig.recordingApi.baseConfig.baseURL);

  return { stubbedAccuwareApi, stubbedRecordingsApi };
};


module.exports = setUpStubbedApis;
