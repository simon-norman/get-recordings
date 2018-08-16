
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
      developmentSiteId: 1001,
    },
  },

  test: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
    },
  },

  qa: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
    },
  },

  production: {
    accuwareApi: {
      baseConfig: configSharedAcrossEnvironments.accuwareApiConfig,
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
