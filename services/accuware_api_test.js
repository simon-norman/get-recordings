
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

  describe('Errors when creating accuware api stamp', () => {
    it('should throw error if base api stamp not provided', async () => {
      const createAccuwareApi = () => {
        AccuwareApiStampFactory();
      };

      expect(createAccuwareApi).to.throw(TypeError);
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
      const createAccuwareApi = () => {
        AccuwareApiStamp(locationsCallParams);
      };

      expect(createAccuwareApi).to.throw(TypeError);
    });

    it('should throw error if interval period not provided', async () => {
      delete locationsCallParams.intervalPeriodInSeconds;
      const createAccuwareApi = () => {
        AccuwareApiStamp(locationsCallParams);
      };

      expect(createAccuwareApi).to.throw(TypeError);
    });
  });

  describe('Get device locations successfully', () => {
    beforeEach(() => {
      setUpTests();
    });

    it('should call accuware api with specified parameters', async () => {
      await accuwareApi.getDeviceLocations();

      expect(getStub.calledWithExactly(
        `/sites/${locationsCallParams.siteId}/stations/`,
        {
          loc: locationsCallParams.includeLocations,
          type: locationsCallParams.devicesToInclude,
          lrrt: locationsCallParams.intervalPeriodInSeconds,
          areas: locationsCallParams.areas,
        },
      )).to.equal(true);
    });

    it('should return device locations', async () => {
      const deviceLocations = await accuwareApi.getDeviceLocations();
      expect(deviceLocations).to.equal(stubbedDeviceLocations);
    });
  });
});

