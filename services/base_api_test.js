
const { expect } = require('chai');

const BaseApiStampFactory = require('./base_api.js');


describe('accuware_api', () => {
  it('should create api initiliased with the base URL and credentials', async () => {
    const apiConfig = {
      baseUrl: 'https://baseUrl.com',
      headers: {
        authorization: {
          username: 'username',
          password: 'password',
        },
      },
    };

    const BaseApiStamp = BaseApiStampFactory(apiConfig);
    const baseApi = BaseApiStamp();

    expect(baseApi.axios.defaults.baseURL).to.equal(apiConfig.baseUrl);
    expect(baseApi.axios.defaults.headers.auth.username)
      .to.equal(apiConfig.headers.authorization.username);
    expect(baseApi.axios.defaults.headers.auth.password)
      .to.equal(apiConfig.headers.authorization.password);
  });
});

