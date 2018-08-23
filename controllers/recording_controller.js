
const stampit = require('stampit');

module.exports = (EventEmittableStamp, Recording) => {
  const RecordingControllerStamp = stampit({
    init() {
      this.Recording = Recording;
    },

    methods: {
      saveSingleRecording(recording) {
        const recordingModel = new this.Recording({
          objectId: recording.objectId,
          timestampRecorded: recording.timestampRecorded,
          longitude: recording.longitude,
          latitude: recording.latitude,
          spaceIds: recording.spaceIds,
        });

        return recordingModel.save();
      },
    },
  });
  return EventEmittableStamp.compose(RecordingControllerStamp);
};
