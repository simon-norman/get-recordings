const stampit = require('stampit');

module.exports = (RetryEnabledApiStamp) => {
  const AccuwareApiStamp = stampit({
    props: {
      baseDeviceRecordingsPath: '/sites/siteId/stations/',
    },

    methods: {
      async getDeviceRecordings({ siteId, intervalPeriodInSeconds }) {
        const timestampCallMade = Date.now();
        const finalDeviceRecordingsPath = this.baseDeviceRecordingsPath.replace('siteId', siteId);

        try {
          const response = await this.get(
            finalDeviceRecordingsPath,
            {
              lrrt: intervalPeriodInSeconds,
              includeLocations: 'yes',
              devicesToInclude: 'all',
              areas: 'yes',
            },
          );

          return { response, timestampCallMade };
        } catch (error) {
          throw error;
        }
      },
    },
  });
  return AccuwareApiStamp.compose(RetryEnabledApiStamp);
};
