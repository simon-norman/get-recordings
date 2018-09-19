

const stampit = require('stampit');

module.exports = (
  RecoverableInvalidRecordingError,
  logException,
  recordingApi
) => stampit({
  props: {
    RecoverableInvalidRecordingError,
    logException,
    recordingApi,
  },

  init(recordingConverter) {
    this.recordingConverter = recordingConverter;
  },

  methods: {
    async saveRecordingsInUsageAnalysisFormat(recordings, timestampRecorded) {
      const convertedRecordings
        = await this.convertAllRecordingsToUsageAnalysisFormat(recordings, timestampRecorded);

      if (convertedRecordings.length > 0) {
        await this.recordingApi.saveRecordings(convertedRecordings);
      }
    },

    async convertAllRecordingsToUsageAnalysisFormat(recordings, timestampRecorded) {
      const promisesToConvertRecordings = [];

      for (const recording of recordings) {
        const promiseToConvertRecording
         = this.getPromiseToConvertRecording(recording, timestampRecorded);

        promisesToConvertRecordings.push(promiseToConvertRecording);
      }
      const convertedRecordings = await Promise.all(promisesToConvertRecordings);

      return convertedRecordings.filter(convertedRecording => convertedRecording !== undefined);
    },

    async getPromiseToConvertRecording(recording, timestampRecorded) {
      return new Promise(async (resolve, reject) => {
        try {
          const convertedRecording = await this.recordingConverter
            .convertRecordingForUsageAnalysis(recording, timestampRecorded);

          resolve(convertedRecording);
        } catch (error) {
          this.handleConvertRecordingError(error, resolve, reject);
        }
      });
    },

    handleConvertRecordingError(error, resolve, reject) {
      if (error instanceof this.RecoverableInvalidRecordingError) {
        logException(error);
        resolve();
      } else {
        reject(error);
      }
    },
  },
});

