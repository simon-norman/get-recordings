const stampit = require('stampit');

module.exports = InvalidAccuwareRecordingError => stampit({
  props: {
    InvalidAccuwareRecordingError,
  },

  methods: {
    convertRecordingForUsageAnalysis(accuwareRecording, timestampRecorded) {
      this.checkRecordingValid(accuwareRecording);
      return {
        objectId: accuwareRecording.mac,
        longitude: accuwareRecording.loc.lng,
        latitude: accuwareRecording.loc.lat,
        spaceIds: accuwareRecording.areas,
        timestampRecorded,
      };
    },

    checkRecordingValid(accuwareRecording) {
      if (!accuwareRecording.loc || !accuwareRecording.loc.lng || !accuwareRecording.loc.lat) {
        throw new this.InvalidAccuwareRecordingError('Recording location not provided');
      }
      return true;
    },
  },
});

