import stampit from 'stampit';

module.exports = () => {
  const AccuwareApiFactory = stampit({
    props: {
      accuwareBaseUrl: 'https://its.accuware.com/api/v1',
      baseDeviceLocationsPath: '/sites/siteId/stations/',
    },

    init({
      axios,
      siteId,
      intervalPeriodInSeconds,
      includeLocations = 'yes',
      devicesToInclude = 'all',
      areas = 'yes',
    }) {
      this.axios = axios.create({
        baseURL: this.accuwareBaseUrl,
        responseType: 'json',
      });
      this.locationsCallParams.setFinalDeviceLocationsPath(siteId);
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
  return AccuwareApiFactory;
};

