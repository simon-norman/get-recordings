

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
      getRecordingsObject.on(returnedRecordingsEventName, (returnedPromise) => {
        this.handleApiResponse(returnedPromise);
      });

      getRecordings();
    },

    handleApiResponse(returnedPromise) {
      returnedPromise
        .then((response) => {
          this.recordingsWriterForUsageAnalysis.saveRecordingsInUsageAnalysisFormat(response.data);
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

