
const chai = require('chai');
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

  const stubApis = ({ diContainer, unconvertedRecordings }) => {
    const accessTokensGetter = diContainer.getDependency('accessTokensGetter');
    const accuwareApi = diContainer.getDependency('accuwareApi');
    const recordingApi = diContainer.getDependency('recordingApi');

    const accuwareApiStubConfig = Object.assign(siteConfig, { accuwareApi, unconvertedRecordings });

    getAccuwareRecordingsStub = stubGetAccuwareRecordings(accuwareApiStubConfig);
    stubSaveRecordings({ recordingApi });
    stubGetAccessToken({ accessTokensGetter });
  };

  beforeEach(async () => {
    const diContainer = await newUnconvertedRecordingsGetter();
    unconvertedRecordingsGetter = diContainer.getDependency('unconvertedRecordingsGetter');

    const unconvertedRecordings
      = unconvertedRecordingsFactory.generateMultipleUnconvertedRecordings({ noOfRecordings: 3 });

    siteConfig = {
      siteId: 1001,
      intervalPeriodInSeconds: 0.010,
    };

    stubApis({ diContainer, unconvertedRecordings });
  });

  context('Given that the service is called with an interval period and a site ID', async function () {
    let expectedParamsToBePassedToAccApi;

    beforeEach(async () => {
      unconvertedRecordingsGetter.startGettingRecordings(siteConfig);

      expectedParamsToBePassedToAccApi = [
        `/sites/${siteConfig.siteId}/stations/`,
        {
          lrrt: siteConfig.intervalPeriodInSeconds,
          includeLocations: 'yes',
          devicesToInclude: 'all',
          areas: 'yes',
        },
      ];

      await setPromisifiedTimeout(25);
    });

    it('should call accuware api every X seconds, where X equals the interval period specified', function () {
      expect(getAccuwareRecordingsStub.callCount).equals(2);
    });

    it('should, on each call, specify the site ID and lrrt (equal to intervalPeriod) equal to those specified, and default the other params', function () {
      getAccuwareRecordingsStub.args.forEach((argsInGetRecsCall) => {
        expect(argsInGetRecsCall).deep.equals(expectedParamsToBePassedToAccApi);
      });
    });
    it('should, on each call, specify the site id');
  });
});
