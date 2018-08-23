const stampit = require('stampit');

module.exports = (InvalidLocationInRecordingError, InvalidTimestampInRecordingError) => stampit({
  props: {
    InvalidLocationInRecordingError,
    InvalidTimestampInRecordingError,
  },

  methods: {
    convertRecordingForUsageAnalysis(accuwareRecording, timestampRecorded) {
      this.checkRecordingValid(accuwareRecording, timestampRecorded);
      return {
        objectId: accuwareRecording.mac,
        longitude: accuwareRecording.loc.lng,
        latitude: accuwareRecording.loc.lat,
        spaceIds: accuwareRecording.areas,
        timestampRecorded,
      };
    },

    checkRecordingValid(accuwareRecording, timestampRecorded) {
      if (!accuwareRecording.loc || !accuwareRecording.loc.lng || !accuwareRecording.loc.lat) {
        throw new this.InvalidLocationInRecordingError('Recording location not provided');
      }
      if (!timestampRecorded || isNaN(timestampRecorded)) {
        throw new this.InvalidTimestampInRecordingError('Invalid timestamp provided to recording');
      }
      return true;
    },
  },
});

