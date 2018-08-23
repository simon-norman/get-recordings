
const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const AccuwareApiStampFactory = require('./accuware_api.js');


describe('accuware_api', () => {
  let stubbedDeviceLocations;
  let getStub;
  let BaseApiStamp;
  let locationsCallParams;
  let AccuwareApiStamp;
  let accuwareApi;

  const setUpAxiosBaseApiStub = () => {
    stubbedDeviceLocations = 'devicelocations';
    getStub = sinon.stub();
    getStub.returns(stubbedDeviceLocations);
    BaseApiStamp = stampit({
      init() {
        this.get = getStub;
      },
    });
  };

  const setLocationsCallParams = () => {
    locationsCallParams = {
      siteId: '10',
      includeLocations: 'yes',
      devicesToInclude: 'all',
      intervalPeriodInSeconds: 1,
      areas: 'yes',
    };
  };

  const setUpTests = () => {
    setUpAxiosBaseApiStub();

    setLocationsCallParams();

    AccuwareApiStamp = AccuwareApiStampFactory(BaseApiStamp);
    accuwareApi = AccuwareApiStamp(locationsCallParams);
  };

  describe('Get device locations successfully', () => {
    beforeEach(() => {
      setUpTests();
    });

    it('should call accuware api with specified parameters', async () => {
      await accuwareApi.getDeviceLocations();

      expect(getStub.calledWithExactly(
        `/sites/${locationsCallParams.siteId}/stations/`,
        {
          params: {
            loc: locationsCallParams.includeLocations,
            type: locationsCallParams.devicesToInclude,
            lrrt: locationsCallParams.intervalPeriodInSeconds,
            areas: locationsCallParams.areas,
          },
        },
      )).to.equal(true);
    });

    it('should return device locations as the first parameter', async () => {
      const deviceLocations = await accuwareApi.getDeviceLocations().response;
      expect(deviceLocations).to.equal(stubbedDeviceLocations);
    });

    it('should return the timestamp, as miliseconds since UNIX epoch, that the call was made as the second parameter', async () => {
      const timestampCallMade = await accuwareApi.getDeviceLocations().timestampCallMade;
      expect(isNaN(timestampCallMade)).to.equal(false);
    });
  });

  describe('Errors when creating accuware api stamp', () => {
    it('should throw error if base api stamp not provided', async () => {
      const createStampWithoutParameters = () => {
        AccuwareApiStampFactory();
      };

      expect(createStampWithoutParameters).to.throw(TypeError);
    });
  });

  describe('Errors when creating accuware api instance', () => {
    beforeEach(() => {
      setUpAxiosBaseApiStub();

      setLocationsCallParams();

      AccuwareApiStamp = AccuwareApiStampFactory(BaseApiStamp);
    });

    it('should throw error if site id not provided', async () => {
      delete locationsCallParams.siteId;
      const createAccuwareApiWithoutSiteId = () => {
        AccuwareApiStamp(locationsCallParams);
      };

      expect(createAccuwareApiWithoutSiteId).to.throw(TypeError);
    });

    it('should throw error if interval period not provided', async () => {
      delete locationsCallParams.intervalPeriodInSeconds;
      const createAccuwareApiWithoutIntervalPeriod = () => {
        AccuwareApiStamp(locationsCallParams);
      };

      expect(createAccuwareApiWithoutIntervalPeriod).to.throw(TypeError);
    });
  });
});

