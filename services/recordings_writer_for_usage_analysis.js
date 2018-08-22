

const stampit = require('stampit');

module.exports = (recordingController, InvalidLocationInRecordingError) => stampit({
  props: {
    recordingController,
    InvalidLocationInRecordingError,
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

