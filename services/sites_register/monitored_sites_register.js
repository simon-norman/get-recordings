

const stampit = require('stampit');

module.exports = (AccuwareApiStamp, FunctionPollerStamp, unconvertedRecordingsGetter) => stampit({

  props: {
    AccuwareApiStamp,
    FunctionPollerStamp,
    unconvertedRecordingsGetter,
    functionResultEventName: 'newrecordings',
  },

  methods: {
    monitorSite(siteConfig) {
      const accuwareApi = AccuwareApiStamp(siteConfig);

      const getRecordingsObject = this.setUpGetRecordingsObject(siteConfig, accuwareApi);
      const getRecordings = getRecordingsObject.pollFunction.bind(getRecordingsObject);

      this.unconvertedRecordingsGetter.startGettingUnconvertedRecordings({
        getRecordingsObject,
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

      const getRecordingsObject = FunctionPollerStamp(functionPollerConfig);
      return getRecordingsObject;
    },

    stopGettingRecordingsForThisSite() {
      console.log('STOP GETTING RECORDINGS');
      delete this.unconvertedRecordingsGetter;
    },
  },
});

