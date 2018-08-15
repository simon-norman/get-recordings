const stampit = require('stampit');
const axios = require('axios');

module.exports = (apiConfig) => {
  const BaseApiStamp = stampit({
    props: {
      apiConfig,
    },

    init() {
      this.axios = axios.create({
        baseURL: this.apiConfig.baseUrl,
        headers: {
          auth: {
            username: this.apiConfig.headers.authorization.username,
            password: this.apiConfig.headers.authorization.password,
          },
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

