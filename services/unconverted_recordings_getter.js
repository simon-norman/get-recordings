

const stampit = require('stampit');

module.exports = recordingsWriterForUsageAnalysis => stampit({
  props: {
    recordingsWriterForUsageAnalysis,
  },

  methods: {
    startGettingUnconvertedRecordings(
      getRecordingsObject,
      getRecordings,
      returnedRecordingsEventName,
    ) {
      getRecordingsObject.on(returnedRecordingsEventName, (getRecordingsResponse) => {
        this.handleApiResponse(getRecordingsResponse);
      });

      getRecordings();
    },

    handleApiResponse(getRecordingsResponse) {
      getRecordingsResponse.response
        .then((response) => {
          this.recordingsWriterForUsageAnalysis.saveRecordingsInUsageAnalysisFormat(
            response.data,
            getRecordingsResponse.timestampCallMade,
          );
        })
        .catch((error) => {
          this.handleApiResponseError(error);
        });
    },

    handleApiResponseError(error) {
      const responseCode = error.response.status;
      if (responseCode === 401 || responseCode === 400 || responseCode === 403) {
        console.log(error);
        process.exit();
      } else {
        console.log(error);
      }
    },
  },
});

