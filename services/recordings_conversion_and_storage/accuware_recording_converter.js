const stampit = require('stampit');

module.exports = (
  InvalidLocationInRecordingError,
  InvalidTimestampInRecordingError,
  deviceInfoController,
) => stampit({
  props: {
    InvalidLocationInRecordingError,
    InvalidTimestampInRecordingError,
    deviceInfoController,
  },

  methods: {
    async convertRecordingForUsageAnalysis(accuwareRecording, timestampRecorded) {
      this.checkRecordingValid(accuwareRecording, timestampRecorded);

      const convertedRecording = {
        objectId: accuwareRecording.mac,
        longitude: accuwareRecording.loc.lng,
        latitude: accuwareRecording.loc.lat,
        spaceIds: accuwareRecording.areas,
        timestampRecorded,
      };

      return this.tryToAddDeviceInfoToRecording(convertedRecording);
    },

    checkRecordingValid(accuwareRecording, timestampRecorded) {
      if (!accuwareRecording.loc || !accuwareRecording.loc.lng || !accuwareRecording.loc.lat) {
        throw new this.InvalidLocationInRecordingError('Recording location not provided');
      }
      if (!timestampRecorded || isNaN(timestampRecorded)) {
        throw new this.InvalidTimestampInRecordingError('Invalid timestamp provided for recording');
      }
      return true;
    },

    async tryToAddDeviceInfoToRecording(recording) {
      try {
        const { estimatedDeviceCategory }
          = await this.deviceInfoController.getDeviceInfo(recording.objectId);
        recording.estimatedDeviceCategory = estimatedDeviceCategory;

        return recording;
      } catch (error) {
        return recording;
      }
    },
  },
});

