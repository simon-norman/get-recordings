
const stampit = require('stampit');

module.exports = stampit({
  init(Recording) {
    this.Recording = Recording;
  },

  methods: {
    saveRecordings(recordings) {
      for (const recording of recordings) {
        this.saveSingleRecording(recording);
      }
    },

    async saveSingleRecording(recording) {
      const recordingModel = new this.Recording({
        recordedObjectId: recording.recordedObjectId,
        timestampRecorded: recording.timestampRecorded,
        longitude: recording.longitude,
        latitude: recording.latitude,
        spaceIds: recording.spaceIds,
      });

      recordingModel.save()
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
