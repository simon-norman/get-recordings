const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const MonitoredSitesRegisterStampFactory = require('./monitored_sites_register');


describe('monitored_sites_register', function () {
  let setUpMockFunctionPollerStampWithConstructorSpy;
  let mockFunctionPollerConstructorSpy;
  let mockFunctionPollerStamp;
  let setUpMockRecordingsApiStamp;
  let mockRecordingsApiStamp;
  let setUpMockUncovertedRecordingsGetterWithSpy;
  let startGettingUnconvertedRecordingsSpy;
  let mockUnconvertedRecordingsGetter;
  let MonitoredSitesRegisterStamp;
  let monitoredSitesRegister;
  let mockSiteConfig;
  let mockApiConfig;
  let functionResultEventName;

  const setUpDependenciesOfMonitoredSitesRegister = () => {
    setUpMockFunctionPollerStampWithConstructorSpy();

    setUpMockRecordingsApiStamp();

    setUpMockUncovertedRecordingsGetterWithSpy();
  };

  setUpMockFunctionPollerStampWithConstructorSpy = () => {
    mockFunctionPollerConstructorSpy = sinon.spy();
    mockFunctionPollerStamp = stampit({
      init(params) {
        mockFunctionPollerConstructorSpy(params);
      },

      props: {
        dataToTestPollFunctionBoundToThisScope: 'somedata',
      },

      methods: {
        pollFunction() {
          return this.dataToTestPollFunctionBoundToThisScope;
        },

        stopPollFunction() {
        },
      },
    });
  };

  setUpMockRecordingsApiStamp = () => {
    mockRecordingsApiStamp = stampit({
      init({ apiConfig }) {
        this.apiConfig = apiConfig;
      },

      methods: {
        getDeviceRecordings() {
          return this.apiConfig;
        },
      },
    });
  };

  setUpMockUncovertedRecordingsGetterWithSpy = () => {
    startGettingUnconvertedRecordingsSpy = sinon.spy();
    mockUnconvertedRecordingsGetter = {
      startGettingUnconvertedRecordings: startGettingUnconvertedRecordingsSpy,
    };
  };

  const setUpMonitoredSitesRegister = () => {
    MonitoredSitesRegisterStamp
      = MonitoredSitesRegisterStampFactory(
        mockRecordingsApiStamp,
        mockFunctionPollerStamp,
        mockUnconvertedRecordingsGetter,
      );
    monitoredSitesRegister = MonitoredSitesRegisterStamp();
  };

  before(() => {

  });

  beforeEach(() => {
    setUpDependenciesOfMonitoredSitesRegister();

    setUpMonitoredSitesRegister();

    mockSiteConfig = {
      intervalPeriodInSeconds: 5,
    };

    mockApiConfig = 'some api config';

    functionResultEventName = 'newrecordings';
  });

  describe('Register site to start getting recordings for that site', function () {
    it('should instantiate the function poller and pass it the polling interval and event name used to pass the function result', function () {
      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });

      expect(mockFunctionPollerConstructorSpy.firstCall.args[0].pollingIntervalInMilSecs)
        .to.equal(mockSiteConfig.intervalPeriodInSeconds * 1000);
      expect(mockFunctionPollerConstructorSpy.firstCall.args[0].functionResultEventName)
        .to.equal(functionResultEventName);
    });

    it('should pass the poller constructor the api function to get recordings, with the function BOUND to its original scope', function () {
      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });

      const apiFunctionPassedToPollerConstructor
        = mockFunctionPollerConstructorSpy.firstCall.args[0].functionToPoll;

      const dataFromOriginalScopeOfApiFunction = apiFunctionPassedToPollerConstructor();
      expect(dataFromOriginalScopeOfApiFunction).to.equal(mockApiConfig);
    });

    it('should pass recordings getter the function to start getting recordings, with the function BOUND to its original scope', function () {
      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });

      const pollFunctionPassedToMockRecordingsGetter
        = startGettingUnconvertedRecordingsSpy.firstCall.args[0].getRecordings;

      const dataFromOriginalScopeOfPollFunction = pollFunctionPassedToMockRecordingsGetter();
      expect(dataFromOriginalScopeOfPollFunction).to.equal('somedata');
    });

    it('should pass recordings getter the event name to receive recordings and the object to listen on for those events', function () {
      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });

      const mockFunctionPoller = mockFunctionPollerStamp();
      expect(startGettingUnconvertedRecordingsSpy.firstCall.args[0].getRecordingsObject)
        .to.deep.equal(mockFunctionPoller);

      expect(startGettingUnconvertedRecordingsSpy.firstCall.args[0].returnedRecordingsEventName)
        .to.equal(functionResultEventName);
    });

    it('should pass the recordings getter a function to stop getting the recordings, which will delete the recordings getter', function () {
      expect(monitoredSitesRegister.unconvertedRecordingsGetter)
        .to.equal(mockUnconvertedRecordingsGetter);

      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });
      const stopGettingRecordingsFunction
        = startGettingUnconvertedRecordingsSpy.firstCall.args[0].stopGettingRecordingsForThisSite;

      stopGettingRecordingsFunction();

      expect(monitoredSitesRegister.unconvertedRecordingsGetter).to.equal(undefined);
    });

    it('should instruct recordings getter to start getting recordings', function () {
      monitoredSitesRegister.monitorSite({ siteConfig: mockSiteConfig, apiConfig: mockApiConfig });

      expect(startGettingUnconvertedRecordingsSpy.callCount).to.equal(1);
    });
  });
});
