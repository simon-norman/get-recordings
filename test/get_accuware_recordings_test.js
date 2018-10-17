
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const newUnconvertedRecordingsGetter = require('./unconverted_recordings_getter_test_instance_factory.js');
const setUpStubbedApis = require('./stubbed_apis_setup');
const setPromisifiedTimeout = require('./helpers/promisified_timeout');

chai.use(sinonChai);
const { expect } = chai;

describe('Service gets accuware recordings, ', function () {
  let unconvertedRecordingsGetter;
  let recordingApi;
  let accuwareApi;
  let stubbedAccuwareApi;

  beforeEach(async () => {
    ({ unconvertedRecordingsGetter, recordingApi, accuwareApi } = await newUnconvertedRecordingsGetter());

    ({ stubbedAccuwareApi } = setUpStubbedApis({ recordingApi, accuwareApi }));
  });

  context('Given that the service is called with an interval period of 5 milliseconds and a site ID', function () {
    beforeEach(async () => {
      const siteConfig = {
        siteId: 1001,
        intervalPeriodInSeconds: 0.005,
      };

      unconvertedRecordingsGetter.startGettingRecordings(siteConfig);
    });

    it('should call accuware api every 5 milliseconds', async function () {
      await setPromisifiedTimeout(100);
      expect(stubbedAccuwareApi).to.have.been.calledTwice();
    });
    it('should, on each call, specify an lrrt of 5 seconds');
    it('should, on each call, specify the site id');
    it('should, on each call, specify that includeLocations = "yes"');
    it('should, on each call, specify that devicesToInclude = "yes"');
    it('should, on each call, specify that areas = "yes"');
  });
});
