const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const MonitoredSitesRegisterStampFactory = require('./monitored_sites_register');


describe('monitored_sites_register', function () {
  let mockFunctionPollerStamp;
  let mockFunctionPoller;
  let mockRecordingsApiStamp;
  let startGettingUnconvertedRecordingsSpy;
  let mockUnconvertedRecordingsGetter;
  let MonitoredSitesRegisterStamp;
  let monitoredSitesRegister;
  let siteConfig;

  before(() => {
    mockFunctionPollerStamp = stampit({
      props: {
        dataToTestPollFunctionBoundWhenPassedToRecordingsGetter: 'somedata',
      },

      methods: {
        pollFunction() {
          return this.someData;
        },
      },
    });
    mockFunctionPoller = mockFunctionPollerStamp();

    mockRecordingsApiStamp = stampit({
      props: {
        dataToTestGetDeviceFunctionBoundWhenPassedToFunctionPoller: 'somedata',
      },

      methods: {
        getDeviceLocations() {
        },
      },
    });

    startGettingUnconvertedRecordingsSpy = sinon.spy();
    mockUnconvertedRecordingsGetter = {
      startGettingUnconvertedRecordings: startGettingUnconvertedRecordingsSpy,
    };

    MonitoredSitesRegisterStamp
      = MonitoredSitesRegisterStampFactory(
        mockRecordingsApiStamp,
        mockFunctionPollerStamp,
        mockUnconvertedRecordingsGetter,
      );
    monitoredSitesRegister = MonitoredSitesRegisterStamp();

    siteConfig = {
      intervalPeriodInSeconds: 5,
    };
  });

  beforeEach(() => {
    startGettingUnconvertedRecordingsSpy.resetHistory();
  });

  describe('Register site to start getting recordings for that site', function () {
    it('should instruct unconverted recordings getter to start getting recordings', function () {
      monitoredSitesRegister.monitorSite(siteConfig);

      expect(startGettingUnconvertedRecordingsSpy.callCount).to.equal(1);

      expect(startGettingUnconvertedRecordingsSpy.firstCall.args[0])
        .to.deep.equal(mockFunctionPoller);
      const pollFunctionPassedToMockRecordingsGetter
        = startGettingUnconvertedRecordingsSpy.firstCall.args[1];

      expect(pollFunctionPassedToMockRecordingsGetter()).to.equal('somedata');

      expect(startGettingUnconvertedRecordingsSpy.firstCall.args[2])
        .to.equal('newrecordings');
    });
  });
});
