

const stampit = require('stampit');

module.exports = (
  AccuwareApiStamp,
  FunctionPollerStamp,
  unconvertedRecordingsGetter,
) => stampit({

  props: {
    AccuwareApiStamp,
    FunctionPollerStamp,
    unconvertedRecordingsGetter,
    functionResultEventName: 'newrecordings',
  },

  methods: {
    monitorSite(siteConfig) {
      const accuwareApi = AccuwareApiStamp(siteConfig);

      const functionPollerConfig = {
        functionToPoll: accuwareApi.getDeviceLocations.bind(accuwareApi),
        functionResultEventName: this.functionResultEventName,
        pollingIntervalInMilSecs: siteConfig.intervalPeriodInSeconds * 1000,
      };
      const functionPoller = FunctionPollerStamp(functionPollerConfig);

      unconvertedRecordingsGetter.startGettingUnconvertedRecordings(
        functionPoller,
        functionPoller.pollFunction.bind(functionPoller),
        this.functionResultEventName,
      );
    },
  },
});

