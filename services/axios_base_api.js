import stampit from 'stampit';

module.exports = () => {
  const AxiosBaseApiFactory = stampit({
    init({ axios, baseUrl }) {
      this.axios = axios.create({
        baseURL: baseUrl,
        responseType: 'json',
      });
    },
  });
  return AxiosBaseApiFactory;
};

