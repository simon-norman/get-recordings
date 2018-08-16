
const { expect } = require('chai');

const BaseApiStampFactory = require('./base_api.js');


describe('base_api', () => {
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
    expect(baseApi.axios.defaults.auth.username)
      .to.equal(apiConfig.headers.authorization.username);
    expect(baseApi.axios.defaults.auth.password)
      .to.equal(apiConfig.headers.authorization.password);
  });

  it('should throw error if api config not provided', async () => {
    const createAccuwareApi = () => {
      BaseApiStampFactory();
    };

    expect(createAccuwareApi).to.throw(TypeError);
  });
});
