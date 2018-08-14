const stampit = require('stampit');

module.exports = (AxiosBaseApiStamp) => {
  const AccuwareApiStamp = stampit({
    props: {
      baseDeviceLocationsPath: '/sites/siteId/stations/',
      locationsCallParams: {},
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
      this.locationsCallParams.lrrt = intervalPeriodInSeconds;
      this.locationsCallParams.loc = includeLocations;
      this.locationsCallParams.type = devicesToInclude;
      this.locationsCallParams.areas = areas;
    },

    methods: {
      getDeviceLocations() {
        return this.axios.get(
          `${this.finalDeviceLocationsPath}`,
          this.locationsCallParams,
        );
      },

      setFinalDeviceLocationsPath(siteId) {
        this.finalDeviceLocationsPath = this.baseDeviceLocationsPath.replace('siteId', siteId);
      },
    },
  });
  return AxiosBaseApiStamp.compose(AccuwareApiStamp);
};

