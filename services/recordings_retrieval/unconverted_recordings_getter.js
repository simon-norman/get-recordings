

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

    handleApiResponse({ response, timestampCallMade }) {
      response
        .then(({ data }) => {
          this.recordingsWriterForUsageAnalysis.saveRecordingsInUsageAnalysisFormat(
            data,
            timestampCallMade,
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

