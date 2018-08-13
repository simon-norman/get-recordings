
const { expect } = require('chai');
const sinon = require('sinon');

const accuwareApiFactory = require('./accuware_api.js');


describe('accuware_api', () => {
  it('should call accuware api with specified parameters', async () => {
    const accuwareGetStub = sinon.stub();
    accuwareGetStub.returns({ device: 'devicedata' });
    const accuwareApi = accuwareApiFactory(accuwareGetStub);
    const locationsCallParams = {
      siteId: '10',
      includeLocations: 'yes',
      devicesToInclude: 'all',
      intervalPeriodInSeconds: 1,
      areas: 'yes',
    };

    accuwareApi.registerForDeviceLocations(locationsCallParams);
    setTimeout(() => {
      expect(accuwareGetStub.callCount)
        .to.equal(locationsCallParams.intervalPeriodInSeconds / 2000);
      expect(accuwareGetStub.alwaysCalledWithExactly(
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
    }, 2000);
  });
/*   accuwareApi.registerForDeviceLocations()
  .on('locationdata', (deviceLocations) => {
    expect(accuwareGetStub)
  }) */
});

