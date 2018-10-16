
const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const sinonChai = require('sinon-chai');
const newMonitoredSitesRegister = require('./monitored_sites_register_test_instance_factory.js');

chai.use(sinonChai);

describe('Service gets accuware recordings, ', function () {
  let monitoredSiteRegister;

  beforeEach(() => {
    monitoredSiteRegister = newMonitoredSitesRegister();
  });

  context('Given that the service is called with an interval period of 5 milliseconds and a site ID', function () {
    let stubbedAccuwareApi;

    beforeEach(() => {
      stubbedAccuwareApi = sinon.stub('post', axios).withArgs(fakeAccApiEndpoint);

      const getRecordingsParams = {
        siteId: 1001,
        intervalPeriodInSeconds: 5,
      };

      monitoredSiteRegister.monitorSite(getRecordingsParams);
    });

    it('should call accuware api every 5 milliseconds', function () {
      expect(stubbedAccuwareApi).to.have.been.calledTwice();
    });
    it('should, on each call, specify an lrrt of 5 seconds');
    it('should, on each call, specify the site id');
    it('should, on each call, specify that includeLocations = "yes"');
    it('should, on each call, specify that devicesToInclude = "yes"');
    it('should, on each call, specify that areas = "yes"');
  });
});
