
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const newUnconvertedRecordingsGetter = require('./unconverted_recordings_getter_test_instance_factory.js');
const setPromisifiedTimeout = require('./helpers/promisified_timeout');
const stubGetAccuwareRecordings = require('./stubs/get_accuware_recordings_stub.js');
const stubSaveRecordings = require('./stubs/save_recordings_stub.js');
const stubGetAccessToken = require('./stubs/get_access_token_stub.js');
const unconvertedRecordingsFactory = require('./test_data_factories/unconverted_recordings_factory.js');

chai.use(sinonChai);
const { expect } = chai;

describe('Service gets accuware recordings, ', function () {
  let unconvertedRecordingsGetter;
  let siteConfig;
  let getAccuwareRecordingsStub;

  beforeEach(async () => {
    const diContainer = await newUnconvertedRecordingsGetter();

    unconvertedRecordingsGetter = diContainer.getDependency('unconvertedRecordingsGetter');
    const unconvertedRecordings
      = unconvertedRecordingsFactory.generateMultipleUnconvertedRecordings({ noOfRecordings: 3 });

    const accuwareApi = diContainer.getDependency('accuwareApi');
    const recordingApi = diContainer.getDependency('recordingApi');
    const accessTokensGetter = diContainer.getDependency('accessTokensGetter');

    siteConfig = {
      siteId: 1001,
      intervalPeriodInSeconds: 0.005,
    };

    const accuwareApiStubConfig = Object.assign(siteConfig, { accuwareApi, unconvertedRecordings });

    getAccuwareRecordingsStub = stubGetAccuwareRecordings(accuwareApiStubConfig);
    stubSaveRecordings({ recordingApi });
    stubGetAccessToken({ accessTokensGetter });
  });

  context('Given that the service is called with an interval period of 5 milliseconds and a site ID', function () {
    beforeEach(async () => {
      unconvertedRecordingsGetter.startGettingRecordings(siteConfig);
    });

    it('should call accuware api every 5 milliseconds', async function () {
      await setPromisifiedTimeout(100);
      expect(getAccuwareRecordingsStub).to.have.been.calledTwice();
    });
    it('should, on each call, specify an lrrt of 5 seconds');
    it('should, on each call, specify the site id');
    it('should, on each call, specify that includeLocations = "yes"');
    it('should, on each call, specify that devicesToInclude = "yes"');
    it('should, on each call, specify that areas = "yes"');
  });
});
