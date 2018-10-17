

const testingConfig = {
  accuwareApi: {
    baseURL: 'https://fake.accuware.com',
    auth: {
      username: 'Some username',
      password: 'some password',
    },
  },

  recordingApi: {
    baseConfig: {
      baseURL: 'http://fake.recordingapi.com',
    },
    recordingsApiAccessTokenConfig: {
      accessTokenServerUrl: 'https://recordings.eu.auth0.com/oauth/token',
      credentialsToGetAccessToken: {
        grant_type: 'client_credentials',
        client_id: 'fake client id',
        client_secret: 'fake client secret',
        audience: 'https://fake-api-recording-audience-url.com',
      },
    },
  },

  recordingDatabase: {
    uri: 'mongodb://localhost:27017/tracking_app_dev',
  },
};

module.exports = testingConfig;
