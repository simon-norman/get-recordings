

const stampit = require('stampit');

module.exports = (recordingsWriterForUsageAnalysis, logException) => stampit({
  props: {
    recordingsWriterForUsageAnalysis,
    logException,
  },

  methods: {
    startGettingUnconvertedRecordings({
      getRecordingsObject,
      getRecordings,
      returnedRecordingsEventName,
      stopGettingRecordingsForThisSite,
    }) {
      this.getRecordingsObject = getRecordingsObject;
      this.returnedRecordingsEventName = returnedRecordingsEventName;
      this.stopGettingRecordingsForThisSite = stopGettingRecordingsForThisSite;

      this.getRecordingsObject.on(returnedRecordingsEventName, (getRecordingsResponse) => {
        this.handleApiResponse(getRecordingsResponse);
      });

      getRecordings();
    },

    handleApiResponse({ response, timestampCallMade }) {
      response
        .then(({ data }) => {
          this.saveRecordingsInUsageAnalysisFormat(data, timestampCallMade);
        })
        .catch((error) => {
          this.handleApiResponseError(error);
        });
    },

    saveRecordingsInUsageAnalysisFormat(unconvertedRecordings, timestampCallMade) {
      try {
        this.recordingsWriterForUsageAnalysis.saveRecordingsInUsageAnalysisFormat(
          unconvertedRecordings,
          timestampCallMade,
        );
      } catch (error) {
        this.stopGettingRecordingsForThisSite();
        this.logException(error);
      }
    },

    handleApiResponseError(error) {
      const responseCode = error.response.status;
      if (responseCode === 401 || responseCode === 400 || responseCode === 403) {
        this.stopGettingRecordingsForThisSite();
        this.logException(error);
      } else {
        this.logException(error);
      }
    },
  },
});

