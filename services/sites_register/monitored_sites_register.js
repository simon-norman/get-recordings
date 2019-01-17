

const stampit = require('stampit');

module.exports = (AccuwareApiStamp, FunctionPollerStamp, unconvertedRecordingsGetter) => stampit({

  props: {
    AccuwareApiStamp,
    FunctionPollerStamp,
    unconvertedRecordingsGetter,
    functionResultEventName: 'newrecordings',
  },

  methods: {
    monitorSite({ apiConfig, siteConfig }) {
      const accuwareApi = AccuwareApiStamp({ apiConfig, siteConfig });

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

