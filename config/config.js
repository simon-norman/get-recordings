
const configSharedAcrossEnvironments = {
  accuwareApi: {
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
    accuwareApi: configSharedAcrossEnvironments.accuwareApi,
  },

  test: {
    accuwareApi: configSharedAcrossEnvironments.accuwareApi,
  },

  qa: {
    accuwareApi: configSharedAcrossEnvironments.accuwareApi,
  },

  production: {
    accuwareApi: configSharedAcrossEnvironments.accuwareApi,
  },
};

const getConfigForEnvironment = (environment) => {
  if (config[environment]) {
    return config[environment];
  }
  throw new Error(`Environment titled ${environment} was not found`);
};

module.exports = { getConfigForEnvironment };
