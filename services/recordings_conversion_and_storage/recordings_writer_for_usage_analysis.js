

const stampit = require('stampit');

module.exports = (recordingController, InvalidLocationInRecordingError, logException) => stampit({
  props: {
    recordingController,
    InvalidLocationInRecordingError,
    logException,
  },

  init(recordingConverter) {
    this.recordingConverter = recordingConverter;
  },

  methods: {
    saveRecordingsInUsageAnalysisFormat(recordings, timestampRecorded) {
      for (const recording of recordings) {
        try {
          this.saveSingleRecordingInUsageAnalysisFormat(recording, timestampRecorded);
        } catch (error) {
          if (error instanceof this.InvalidLocationInRecordingError) {
            logException(error);
            continue;
          } else {
            throw error;
          }
        }
      }
    },

    saveSingleRecordingInUsageAnalysisFormat(recording, timestampRecorded) {
      const convertedRecording = this.recordingConverter
        .convertRecordingForUsageAnalysis(recording, timestampRecorded);

      recordingController.saveSingleRecording(convertedRecording);
    },
  },
});

