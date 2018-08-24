const stampit = require('stampit');

const required = (msg) => {
  throw new Error(msg);
};

module.exports = (BaseApiStamp = required('BaseApiStamp arg is required')) => {
  if (BaseApiStamp) {
    const privateMethod = Symbol('privateMethod');
    const AccuwareApiStamp = stampit({
      props: {
        baseDeviceLocationsPath: '/sites/siteId/stations/',
        locationsCallParams: {
          params: {
          },
        },
      },

      init({
        siteId,
        intervalPeriodInSeconds,
        includeLocations = 'yes',
        devicesToInclude = 'all',
        areas = 'yes',
      }) {
        if (!siteId) {
          throw new TypeError('Site ID not provided to get device locations');
        }

        if (!intervalPeriodInSeconds) {
          throw new TypeError('Interval period not provided to get device locations (e.g. get devices detected in last 15 seconds');
        }

        this.setFinalDeviceLocationsPath(siteId);
        /* this.locationsCallParams.params = {
          lrrt: intervalPeriodInSeconds,
          loc: includeLocations
        } */
        this.locationsCallParams.params.lrrt = intervalPeriodInSeconds;
        this.locationsCallParams.params.loc = includeLocations;
        this.locationsCallParams.params.type = devicesToInclude;
        this.locationsCallParams.params.areas = areas;
      },

      methods: {
        [privateMethod]() {
          // test private method
        },
        getDeviceLocations() {
          const timestampCallMade = Date.now();

          const response = this.get(
            this.finalDeviceLocationsPath,
            this.locationsCallParams,
          );

          return {
            response,
            timestampCallMade,
          };
        },

        setFinalDeviceLocationsPath(siteId) {
          this.finalDeviceLocationsPath = this.baseDeviceLocationsPath.replace('siteId', siteId);
        },
      },
    });
    return AccuwareApiStamp.compose(BaseApiStamp);
  }
  throw new TypeError('Base API stamp not provided');
};

