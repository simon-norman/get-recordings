
const config = {

  development: {
    accuwareApi: {
      baseUrl: process.env.MONGODB_URI,
    },
  },

  test: {
    accuwareApi: {
      baseUrl: process.env.MONGODB_URI,
    },
  },

  qa: {
    accuwareApi: {
      baseUrl: process.env.MONGODB_URI,
    },
  },

  production: {
    accuwareApi: {
      baseUrl: process.env.MONGODB_URI,
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
