const sinon = require('sinon');

const stubSaveRecordings = (recordingApiWithConfig) => {
  const saveRecordingsStub = sinon.stub(recordingApiWithConfig.recordingApi, 'post');

  saveRecordingsStub.returns(Promise.resolve('Recording saved'));

  return saveRecordingsStub;
};


module.exports = stubSaveRecordings;
