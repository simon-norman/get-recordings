
const { expect } = require('chai');
const sinon = require('sinon');

const AccuwareApiFactory = require('./accuware_api.js');


describe('accuware_api', () => {
  it('should call accuware api with specified parameters', async () => {
    const axiosStub = sinon.stub();
    axiosStub.returns({ device: 'devicedata' });
    const locationsCallParams = {
      axios: axiosStub,
      siteId: '10',
      includeLocations: 'yes',
      devicesToInclude: 'all',
      intervalPeriodInSeconds: 1,
      areas: 'yes',
    };
    const accuwareApi = AccuwareApiFactory(locationsCallParams);

    accuwareApi.getDeviceLocations();

    expect(axiosStub.calledWithExactly(
      `/sites/${locationsCallParams.siteId}/stations/`,
      {
        params: {
          loc: locationsCallParams.includeLocations,
          type: locationsCallParams.devicesToInclude,
          lrrt: locationsCallParams.intervalPeriodInSeconds,
          areas: locationsCallParams.areas,
        },
      },
    )).to.be.true();
  });
});

