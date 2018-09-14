const stampit = require('stampit');

module.exports = (
  RecoverableInvalidRecordingError,
  InvalidTimestampInRecordingError,
  deviceInfoController,
) => stampit({
  props: {
    RecoverableInvalidRecordingError,
    InvalidTimestampInRecordingError,
    deviceInfoController,
  },

  methods: {
    async convertRecordingForUsageAnalysis(accuwareRecording, timestampRecorded) {
      const recordingWithDeviceInfo = await this.addDeviceInfoToRecording(accuwareRecording);

      this.checkRecordingValid(recordingWithDeviceInfo, timestampRecorded);

      return {
        objectId: accuwareRecording.mac,
        estimatedDeviceCategory: recordingWithDeviceInfo.estimatedDeviceCategory,
        longitude: accuwareRecording.loc.lng,
        latitude: accuwareRecording.loc.lat,
        spaceIds: accuwareRecording.areas,
        timestampRecorded,
      };
    },

    checkRecordingValid(accuwareRecording, timestampRecorded) {
      if (accuwareRecording.estimatedDeviceCategory !== 'Mobile phone') {
        throw new this.RecoverableInvalidRecordingError('Recording is not from a mobile device');
      }

      if (!accuwareRecording.loc || !accuwareRecording.loc.lng || !accuwareRecording.loc.lat) {
        throw new this.RecoverableInvalidRecordingError('Recording location not provided');
      }

      if (!timestampRecorded || isNaN(timestampRecorded)) {
        throw new this.InvalidTimestampInRecordingError('Invalid timestamp provided for recording');
      }

      return true;
    },

    async addDeviceInfoToRecording(recording) {
      const deviceOui = recording.mac.substr(0, 6);
      const deviceInfo
          = await this.deviceInfoController.getDeviceInfo(deviceOui);

      if (!deviceInfo) {
        throw new this.RecoverableInvalidRecordingError('No device info found for this device oui');
      }

      recording.estimatedDeviceCategory = deviceInfo.estimatedDeviceCategory;
      return recording;
    },
  },
});

