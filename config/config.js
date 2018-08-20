
const configSharedAcrossEnvironments = {
  accuwareApiConfig: {
    baseUrl: 'https://its.accuware.com/api/v1',
    headers: {
      authorization: {
        username: process.env.ACCUWARE_API_USERNAME,
        password: process.env.ACCUWARE_API_PASSWORD,
      },
    },
  },
};

const config = {
  development: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      siteId: 1001,
    },
    trackingDatabase: {
      uri: 'mongodb://localhost:27017/tracking_app_dev',
    },
  },

  test: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      siteId: process.env.ACCUWARE_SITE_ID,
    },
    trackingDatabase: {
      uri: process.env.TRACKING_DATABASE,
    },
  },

  qa: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      siteId: process.env.ACCUWARE_SITE_ID,
    },
    trackingDatabase: {
      uri: process.env.TRACKING_DATABASE,
    },
  },

  production: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
      siteId: process.env.ACCUWARE_SITE_ID,
    },
    trackingDatabase: {
      uri: process.env.TRACKING_DATABASE,
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
