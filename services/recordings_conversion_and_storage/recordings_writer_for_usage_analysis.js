

const stampit = require('stampit');

module.exports = (recordingController, RecoverableInvalidRecordingError, logException) => stampit({
  props: {
    recordingController,
    RecoverableInvalidRecordingError,
    logException,
  },

  init(recordingConverter) {
    this.recordingConverter = recordingConverter;
  },

  methods: {
    async saveRecordingsInUsageAnalysisFormat(recordings, timestampRecorded) {
      const promisesToSaveRecordingsInFormat = [];

      for (const recording of recordings) {
        const promiseToSaveRecording
          = this.getPromiseToSaveRecordingInFormat(recording, timestampRecorded);
        promisesToSaveRecordingsInFormat.push(promiseToSaveRecording);
      }

      await Promise.all(promisesToSaveRecordingsInFormat);
    },

    async getPromiseToSaveRecordingInFormat(recording, timestampRecorded) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.saveSingleRecordingInUsageAnalysisFormat(recording, timestampRecorded);
          resolve();
        } catch (error) {
          this.handleSaveRecordingInUsageAnalysisFormatError(error, resolve, reject);
        }
      });
    },

    async saveSingleRecordingInUsageAnalysisFormat(recording, timestampRecorded) {
      const convertedRecording = await this.recordingConverter
        .convertRecordingForUsageAnalysis(recording, timestampRecorded);

      recordingController.saveSingleRecording(convertedRecording);
    },

    handleSaveRecordingInUsageAnalysisFormatError(error, resolve, reject) {
      if (error instanceof this.RecoverableInvalidRecordingError) {
        logException(error);
        resolve();
      } else {
        reject(error);
      }
    },
  },
});

