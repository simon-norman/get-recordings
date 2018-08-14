
const { expect } = require('chai');

const AxiosBaseApiStampFactory = require('./axios_base_api.js');


describe('accuware_api', () => {
  it('should create api initiliased with the base URL', async () => {
    const baseUrl = 'https://baseUrl.com';
    const AxiosBaseApiStamp = AxiosBaseApiStampFactory(baseUrl);
    const axiosBaseApi = AxiosBaseApiStamp();
    expect(axiosBaseApi.axios.defaults.baseURL).to.equal(baseUrl);
  });
});

