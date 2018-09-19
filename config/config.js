
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
        siteId: 1931,
        intervalPeriodInSeconds: 5,
        includeLocations: 'yes',
        devicesToInclude: 'all',
        areas: 'yes',
      },
    },
    recordingApi: {
      baseURL: 'http://localhost:3000',
    },
    recordingDatabase: {
      uri: 'mongodb://localhost:27017/tracking_app_dev',
    },
    webServer: {
      port: 3003,
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
      baseURL: 'http://localhost:3000',
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
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
      baseURL: 'http://localhost:3000',
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
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
      baseURL: 'http://localhost:3000',
    },
    recordingDatabase: {
      uri: process.env.RECORDING_DATABASE_URI,
    },
    webServer: {
      port: process.env.PORT,
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
