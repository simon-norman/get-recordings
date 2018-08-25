const stampit = require('stampit');

const checkStampFactoryArgumentsValid = (BaseApiStamp) => {
  const errors = [];
  if (!BaseApiStamp) {
    errors.push('Base Api Stamp not provided to Accuware Api stamp factory');
  }

  if (errors.length) {
    throw new Error(errors.join('; '));
  }
};

module.exports = (BaseApiStamp) => {
  checkStampFactoryArgumentsValid(BaseApiStamp);
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
      this.checkStampInitArgumentsValid(arguments[0]);

      this.setFinalDeviceRecordingsPath(siteId);
      this.recordingsCallParams.params.lrrt = intervalPeriodInSeconds;
      this.recordingsCallParams.params.loc = includeLocations;
      this.recordingsCallParams.params.type = devicesToInclude;
      this.recordingsCallParams.params.areas = areas;
    },

    methods: {
      checkStampInitArgumentsValid(stampInitArguments) {
        const errors = [];
        if (!stampInitArguments.siteId > 0) {
          errors.push('Site ID not provided to accuware api stamp init');
        }
        if (!stampInitArguments.intervalPeriodInSeconds) {
          errors.push('Interval period not provided to accuware api stamp init');
        }

        if (errors.length) {
          throw new Error(errors.join('; '));
        }
      },

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
};
