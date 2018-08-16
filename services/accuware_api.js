const stampit = require('stampit');

module.exports = (BaseApiStamp) => {
  if (BaseApiStamp) {
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
        this.locationsCallParams.params.lrrt = intervalPeriodInSeconds;
        this.locationsCallParams.params.loc = includeLocations;
        this.locationsCallParams.params.type = devicesToInclude;
        this.locationsCallParams.params.areas = areas;
      },

      methods: {
        getDeviceLocations() {
          return this.get(
            `${this.finalDeviceLocationsPath}`,
            this.locationsCallParams,
          );
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

