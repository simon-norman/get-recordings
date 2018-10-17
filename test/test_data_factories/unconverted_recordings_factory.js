
const unconvertedRecordingsFactory = {
  newUnconvertedRecording() {
    const unconvertedRecording = {
      mac: '485B39HAC5E9',
      loc: {
        lng: -117.114326,
        lat: 32.91186,
      },
      areas: [7, 1],
    };

    return unconvertedRecording;
  },

  generateMultipleUnconvertedRecordings({ noOfRecordings }) {
    const unconvertedRecordings = [];

    for (let recordingNo = 1; recordingNo <= noOfRecordings; recordingNo += 1) {
      unconvertedRecordings.push(this.newUnconvertedRecording());
    }

    return unconvertedRecordings;
  },
};

module.exports = unconvertedRecordingsFactory;

