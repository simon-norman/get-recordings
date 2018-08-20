const stampit = require('stampit');

module.exports = () => stampit({
  methods: {
    convertRecordingsForUsageAnalysis(accuwareRecordings, timestampRecorded) {
      const convertedRecordings = [];
      for (const accuwareRecording of accuwareRecordings) {
        convertedRecordings.push({
          objectId: accuwareRecording.mac,
          longitude: accuwareRecording.loc.lng,
          latitude: accuwareRecording.loc.lat,
          spaceIds: accuwareRecording.areas,
          timestampRecorded,
        });
      }
      return convertedRecordings;
    },
  },
});

