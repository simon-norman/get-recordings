const stampit = require('stampit');

module.exports = (
  InvalidLocationInRecordingError,
  InvalidTimestampInRecordingError,
  deviceInfoController,
  logException
) => stampit({
  props: {
    InvalidLocationInRecordingError,
    InvalidTimestampInRecordingError,
    deviceInfoController,
    logException,
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
      const deviceOui = recording.objectId.substr(0, 6);
      const deviceInfo
          = await this.deviceInfoController.getDeviceInfo(deviceOui);

      if (!deviceInfo) {
        this.logException(new Error('No device info found for this device oui'));
        return recording;
      }

      recording.estimatedDeviceCategory = deviceInfo.estimatedDeviceCategory;
      return recording;
    },
  },
});

