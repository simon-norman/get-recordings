const stampit = require('stampit');
const axios = require('axios');

let apiConfigValidationErrors;

const checkApiConfigHasUsernamePassword = (apiConfig) => {
  try {
    if (!apiConfig.headers.authorization.username) {
      apiConfigValidationErrors.push('No username provided to base api for basic auth');
    }

    if (!apiConfig.headers.authorization.password) {
      apiConfigValidationErrors.push('No password provided to base api for basic auth');
    }
  } catch (error) {
    apiConfigValidationErrors.push(error.message);
  }
};

const checkStampFactoryArgumentsValid = (apiConfig) => {
  if (!apiConfig) {
    throw new Error('api config not provided to Base API stamp factory');
  }

  apiConfigValidationErrors = [];

  checkApiConfigHasUsernamePassword(apiConfig);

  if (apiConfigValidationErrors.length) {
    throw new Error(apiConfigValidationErrors.join('; '));
  }
};

module.exports = (apiConfig) => {
  checkStampFactoryArgumentsValid(apiConfig);
  const BaseApiStamp = stampit({
    props: {
      apiConfig,
    },

    init() {
      this.axios = axios.create({
        baseURL: this.apiConfig.baseUrl,
        auth: {
          username: this.apiConfig.headers.authorization.username,
          password: this.apiConfig.headers.authorization.password,
        },
        responseType: 'json',
      });

      this.get = this.axios.get;

      this.put = this.axios.put;

      this.post = this.axios.post;

      this.patch = this.axios.patch;
    },
  });
  return BaseApiStamp;
};

