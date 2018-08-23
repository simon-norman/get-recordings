const stampit = require('stampit');

module.exports = (BaseApiStamp) => {
  if (BaseApiStamp) {
    const AccuwareApiStamp = stampit({
      props: {
        baseDeviceRecordingsPath: '/sites/siteId/stations/',
        recordingsCallParams: {
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
          throw new TypeError('Site ID not provided to get device recordings');
        }

        if (!intervalPeriodInSeconds) {
          throw new TypeError('Interval period not provided to get device recordings (e.g. get devices detected in last 15 seconds');
        }

        this.setFinalDeviceRecordingsPath(siteId);
        this.recordingsCallParams.params.lrrt = intervalPeriodInSeconds;
        this.recordingsCallParams.params.loc = includeLocations;
        this.recordingsCallParams.params.type = devicesToInclude;
        this.recordingsCallParams.params.areas = areas;
      },

      methods: {
        getDeviceRecordings() {
          const timestampCallMade = Date.now();

          const response = this.get(
            `${this.finalDeviceRecordingsPath}`,
            this.recordingsCallParams,
          );

          return {
            response,
            timestampCallMade,
          };
        },

        setFinalDeviceRecordingsPath(siteId) {
          this.finalDeviceRecordingsPath = this.baseDeviceRecordingsPath.replace('siteId', siteId);
        },
      },
    });
    return AccuwareApiStamp.compose(BaseApiStamp);
  }
  throw new TypeError('Base API stamp not provided');
};

