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

module.exports = (RetryEnabledApiStamp, recordingsApiAccessTokenConfig) => {
  checkStampFactoryArgumentsValid(RetryEnabledApiStamp);
  const RecordingApiStamp = stampit({
    props: {
      baseRecordingsPath: '/recordings',
    },

    methods: {
      async getAccessTokenToRecordingsApi() {
        return this.post(
          recordingsApiAccessTokenConfig.accessTokenServerUrl,
          recordingsApiAccessTokenConfig.credentialsToGetAccessToken,
        );
      },

      async saveRecordings(recordings) {
        let accessToken;
        try {
          accessToken = await this.getAccessTokenToRecordingsApi();
        } catch (error) {
          throw error;
        }

        return this.post(
          this.baseRecordingsPath,
          recordings,
          {
            headers: {
              authorization: `${accessToken.data.token_type} ${accessToken.data.access_token}`,
            },
          }
        );
      },
    },
  });
  return RecordingApiStamp.compose(RetryEnabledApiStamp);
};
