

const stampit = require('stampit');

module.exports = (AccuwareApiStamp, FunctionPollerStamp, AccuwareApiPollerStamp) => stampit({

  props: {
    AccuwareApiStamp,
    FunctionPollerStamp,
    unconvertedRecordingsGetter,
    functionResultEventName: 'newrecordings',
  },

  methods: {
    monitorSite(siteConfig) {
      const accuwareApiPoller = AccuwareApiPollerStamp(siteConfig);
      accuwareApiPoller.startGettingRecordings();

      this.setUpGetRecordingsObject(siteConfig, accuwareApi);
      const getRecordings = this.getRecordingsObject.pollFunction.bind(this.getRecordingsObject);

      this.unconvertedRecordingsGetter.startGettingUnconvertedRecordings({
        getRecordingsObject: this.getRecordingsObject,
        getRecordings,
        returnedRecordingsEventName: this.functionResultEventName,
        stopGettingRecordingsForThisSite: this.stopGettingRecordingsForThisSite.bind(this),
      });
    },

    setUpGetRecordingsObject(siteConfig, accuwareApi) {
      const functionPollerConfig = {
        functionToPoll: accuwareApi.getDeviceRecordings.bind(accuwareApi),
        functionResultEventName: this.functionResultEventName,
        pollingIntervalInMilSecs: siteConfig.intervalPeriodInSeconds * 1000,
      };

      this.getRecordingsObject = FunctionPollerStamp(functionPollerConfig);
    },

    stopGettingRecordingsForThisSite() {
      this.getRecordingsObject.stopPollFunction();
      delete this.getRecordingsObject;
      delete this.unconvertedRecordingsGetter;
    },
  },
});

