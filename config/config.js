
const configSharedAcrossEnvironments = {
  accuwareApiConfig: {
    baseURL: 'https://its.accuware.com/api/v1',
    auth: {
      username: process.env.ACCUWARE_API_USERNAME,
      password: process.env.ACCUWARE_API_PASSWORD,
    },
  },
};

const config = {
  development: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      getDeviceRecordings: {
        siteId: 1001,
        intervalPeriodInSeconds: 5,
        includeLocations: 'yes',
        devicesToInclude: 'all',
        areas: 'yes',
      },
    },
    recordingApi: {
      baseConfig: {
        baseURL: 'http://localhost:3000',
      },
      recordingsApiAccessTokenConfig: {
        accessTokenServerUrl: 'https://recordings.eu.auth0.com/oauth/token',
        credentialsToGetAccessToken: {
          grant_type: 'client_credentials',
          client_id: 'ax40REVrKWMRBBkLaSfIA452F1IVZYEg',
          client_secret: process.env.GET_RECORDINGS_CLIENT_SECRET,
          audience: 'https://api-recording.herokuapp.com/',
        },
      },
    },
    recordingDatabase: {
      uri: 'mongodb://localhost:27017/tracking_app_dev',
    },
    webServer: {
      port: 3003,
    },
    errorLogging: {
      environment: '',
      ravenConfig: {
        dsn: process.env.RAVEN_DSN,
        options: {
          captureUnhandledRejections: true,
        },
      },
    },
  },

  test: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      getDeviceRecordings: {
        siteId: process.env.ACCUWARE_SITE_ID,
        intervalPeriodInSeconds: 5,
        includeLocations: 'yes',
        devicesToInclude: 'all',
        areas: 'yes',
      },
    },
    recordingApi: {
      baseURL: process.env.RECORDING_API_URL,
      recordingsApiAccessTokenConfig: {
        accessTokenServerUrl: 'https://recordings.eu.auth0.com/oauth/token',
        credentialsToGetAccessToken: {
          grant_type: 'client_credentials',
          client_id: 'ax40REVrKWMRBBkLaSfIA452F1IVZYEg',
          client_secret: process.env.GET_RECORDINGS_CLIENT_SECRET,
          audience: 'https://api-recording.herokuapp.com/',
        },
      },
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
    },
    errorLogging: {
      environment: '',
      ravenConfig: {
        dsn: process.env.RAVEN_DSN,
        options: {
          captureUnhandledRejections: true,
        },
      },
    },
  },

  qa: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      getDeviceRecordings: {
        siteId: process.env.ACCUWARE_SITE_ID,
        intervalPeriodInSeconds: 5,
        includeLocations: 'yes',
        devicesToInclude: 'all',
        areas: 'yes',
      },
    },
    recordingApi: {
      baseURL: process.env.RECORDING_API_URL,
      recordingsApiAccessTokenConfig: {
        accessTokenServerUrl: 'https://recordings.eu.auth0.com/oauth/token',
        credentialsToGetAccessToken: {
          grant_type: 'client_credentials',
          client_id: 'ax40REVrKWMRBBkLaSfIA452F1IVZYEg',
          client_secret: process.env.GET_RECORDINGS_CLIENT_SECRET,
          audience: 'https://api-recording.herokuapp.com/',
        },
      },
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
    },
    errorLogging: {
      environment: '',
      ravenConfig: {
        dsn: process.env.RAVEN_DSN,
        options: {
          captureUnhandledRejections: true,
        },
      },
    },
  },

  production: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      getDeviceRecordings: {
        siteId: process.env.ACCUWARE_SITE_ID,
        intervalPeriodInSeconds: 5,
        includeLocations: 'yes',
        devicesToInclude: 'all',
        areas: 'yes',
      },
    },
    recordingApi: {
      baseURL: process.env.RECORDING_API_URL,
      recordingsApiAccessTokenConfig: {
        accessTokenServerUrl: 'https://recordings.eu.auth0.com/oauth/token',
        credentialsToGetAccessToken: {
          grant_type: 'client_credentials',
          client_id: 'ax40REVrKWMRBBkLaSfIA452F1IVZYEg',
          client_secret: process.env.GET_RECORDINGS_CLIENT_SECRET,
          audience: 'https://api-recording.herokuapp.com/',
        },
      },
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
    },
    errorLogging: {
      environment: '',
      ravenConfig: {
        dsn: process.env.RAVEN_DSN,
        options: {
          captureUnhandledRejections: true,
        },
      },
    },
  },
};

const getConfigForEnvironment = (environment) => {
  if (config[environment]) {
    return config[environment];
  }
  throw new Error(`Environment titled ${environment} was not found`);
};

module.exports = { getConfigForEnvironment };
