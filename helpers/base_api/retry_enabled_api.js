const stampit = require('stampit');
const axiosRetry = require('axios-retry');

module.exports = (BaseApiStamp) => {
  const RetryCapableApiStamp = stampit({
    init() {
      axiosRetry(this.axios, {
        retries: 2,
        retryDelay: axiosRetry.exponentialDelay,
      });
    },
  });
  return BaseApiStamp.compose(RetryCapableApiStamp);
};

