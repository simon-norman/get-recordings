
const stampit = require('stampit');

module.exports = Recording => stampit({
  init() {
    this.Recording = Recording;
  },

  methods: {
    saveSingleRecording(recording) {
      const recordingModel = new this.Recording(recording);
      return recordingModel.save();
    },
  },
});
