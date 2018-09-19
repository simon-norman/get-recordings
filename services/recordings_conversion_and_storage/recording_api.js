const stampit = require('stampit');

const checkStampFactoryArgumentsValid = (RetryEnabledApiStamp) => {
  const errors = [];
  if (!RetryEnabledApiStamp) {
    errors.push('Retry Enabled Stamp not provided to Api stamp factory');
  }

  if (errors.length) {
    throw new Error(errors.join('; '));
  }
};

module.exports = (RetryEnabledApiStamp) => {
  checkStampFactoryArgumentsValid(RetryEnabledApiStamp);
  const RecordingApiStamp = stampit({
    props: {
      baseRecordingsPath: '/recordings',
    },

    methods: {
      saveRecordings(recordings) {
        return this.post(this.baseRecordingsPath, recordings);
      },
    },
  });
  return RecordingApiStamp.compose(RetryEnabledApiStamp);
};
