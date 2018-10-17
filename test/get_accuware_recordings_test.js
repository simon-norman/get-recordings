
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
      intervalPeriodInSeconds: 0.010,
    };

    const accuwareApiStubConfig = Object.assign(siteConfig, { accuwareApi, unconvertedRecordings });

    getAccuwareRecordingsStub = stubGetAccuwareRecordings(accuwareApiStubConfig);
    stubSaveRecordings({ recordingApi });
    stubGetAccessToken({ accessTokensGetter });
  });

  context('Given that the service is called with an interval period of 5 milliseconds and a site ID', async function () {
    beforeEach(async () => {
      unconvertedRecordingsGetter.startGettingRecordings(siteConfig);

      await setPromisifiedTimeout(25);
    });

    it('should call accuware api every 10 milliseconds', function () {
      expect(getAccuwareRecordingsStub.callCount).equals(2);
    });

    it(`should, on each call, specify the site ID, lrrt equal to the intervalPeriod, and that devicesToInclude, 
      areas, and includeLocations equal "yes"`, function () {
      getAccuwareRecordingsStub.args.forEach((argsInGetRecsCall) => {
        expect(argsInGetRecsCall[0]).equals(`/sites/${siteConfig.siteId}/stations/`);
        expect(argsInGetRecsCall[1].lrrt).equals(0.01);
        expect(argsInGetRecsCall[1].includeLocations).equals('yes');
        expect(argsInGetRecsCall[1].devicesToInclude).equals('all');
        expect(argsInGetRecsCall[1].areas).equals('yes');
      });
    });
    it('should, on each call, specify the site id');
  });
});
