
const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const AccuwareApiStampFactory = require('./accuware_api.js');


describe('accuware_api', () => {
  let stubbedDeviceRecordings;
  let getStub;
  let BaseApiStamp;
  let recordingsCallParams;
  let AccuwareApiStamp;
  let accuwareApi;

  const setUpAxiosBaseApiStub = () => {
    stubbedDeviceRecordings = 'devicerecordings';
    getStub = sinon.stub();
    getStub.returns(stubbedDeviceRecordings);
    BaseApiStamp = stampit({
      init() {
        this.get = getStub;
      },
    });
  };

  const setRecordingsCallParams = () => {
    recordingsCallParams = {
      siteId: '10',
      includeLocations: 'no',
      devicesToInclude: 'all',
      intervalPeriodInSeconds: 1,
      areas: 'yes',
    };
  };

  const setUpTests = () => {
    setUpAxiosBaseApiStub();

    setRecordingsCallParams();

    AccuwareApiStamp = AccuwareApiStampFactory(BaseApiStamp);
    accuwareApi = AccuwareApiStamp(recordingsCallParams);
  };

  describe('Get device recordings successfully', () => {
    beforeEach(() => {
      setUpTests();
    });

    it('should call accuware api with specified parameters', async () => {
      await accuwareApi.getDeviceRecordings();

      expect(getStub.calledWithExactly(
        `/sites/${recordingsCallParams.siteId}/stations/`,
        {
          params: {
            loc: recordingsCallParams.includeLocations,
            type: recordingsCallParams.devicesToInclude,
            lrrt: recordingsCallParams.intervalPeriodInSeconds,
            areas: recordingsCallParams.areas,
          },
        },
      )).to.equal(true);
    });

    it('should return an object that includes the api response and the timestamp, as UNIX epoch milliseconds, that the call was made', async () => {
      const returnedObject = accuwareApi.getDeviceRecordings();

      const deviceRecordings = await returnedObject.response;
      expect(deviceRecordings).to.equal(stubbedDeviceRecordings);

      expect(isNaN(returnedObject.timestampCallMade)).to.equal(false);
    });
  });

  describe('Errors when creating accuware api stamp', () => {
    it('should throw error if base api stamp not provided', async () => {
      const createStampWithoutParameters = () => {
        AccuwareApiStampFactory();
      };

      expect(createStampWithoutParameters).to.throw(Error);
    });
  });

  describe('Errors when creating accuware api instance', () => {
    beforeEach(() => {
      setUpAxiosBaseApiStub();

      setRecordingsCallParams();

      AccuwareApiStamp = AccuwareApiStampFactory(BaseApiStamp);
    });

    it('should throw error if site id not provided', async () => {
      delete recordingsCallParams.siteId;
      const createAccuwareApiWithoutSiteId = () => {
        AccuwareApiStamp(recordingsCallParams);
      };

      expect(createAccuwareApiWithoutSiteId).to.throw(Error);
    });

    it('should throw error if interval period not provided', async () => {
      delete recordingsCallParams.intervalPeriodInSeconds;
      const createAccuwareApiWithoutIntervalPeriod = () => {
        AccuwareApiStamp(recordingsCallParams);
      };

      expect(createAccuwareApiWithoutIntervalPeriod).to.throw(Error);
    });

    it('should include error messages for each error thrown', function () {
      const createAccuwareApiWithoutParams = () => {
        AccuwareApiStamp();
      };

      try {
        createAccuwareApiWithoutParams();
      } catch (error) {
        const errorMessages = error.message.split(';');
        expect(errorMessages.length).to.equal(2);
      }
    });
  });
});

