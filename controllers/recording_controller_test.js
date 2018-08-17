
const { expect } = require('chai');
// const sinon = require('sinon');
const stampit = require('stampit');

const RecordingControllerStampFactory = require('./recording_controller.js');


describe('recording_controller', () => {
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
  });
});

