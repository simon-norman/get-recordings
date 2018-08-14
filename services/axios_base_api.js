const stampit = require('stampit');
const axios = require('axios');

module.exports = (baseUrl) => {
  const AxiosBaseApiStamp = stampit({
    props: {
      baseUrl,
    },

    init() {
      this.axios = axios.create({
        baseURL: this.baseUrl,
        responseType: 'json',
      });
    },
  });
  return AxiosBaseApiStamp;
};

