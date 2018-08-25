
const { expect } = require('chai');

const BaseApiStampFactory = require('./base_api.js');


describe('base_api', () => {
  let apiConfig;

  const wrappedCreateAccuwareApi = function () {
    BaseApiStampFactory(apiConfig);
  };

  beforeEach(() => {
    apiConfig = {
      baseUrl: 'https://baseUrl.com',
      headers: {
        authorization: {
          username: 'username',
          password: 'password',
        },
      },
    };
  });

  it('should create api initiliased with the base URL and credentials', async function () {
    const BaseApiStamp = BaseApiStampFactory(apiConfig);
    const baseApi = BaseApiStamp();

    expect(baseApi.axios.defaults.baseURL).to.equal(apiConfig.baseUrl);
    expect(baseApi.axios.defaults.auth.username)
      .to.equal(apiConfig.headers.authorization.username);
    expect(baseApi.axios.defaults.auth.password)
      .to.equal(apiConfig.headers.authorization.password);
  });

  it('should throw error if api config not provided', async function () {
    apiConfig = '';

    expect(wrappedCreateAccuwareApi).to.throw(Error);
  });

  it('should throw error if api username not provided', async function () {
    apiConfig.headers.authorization.username = '';

    expect(wrappedCreateAccuwareApi).to.throw(Error);
  });

  it('should throw error if api password not provided', async function () {
    apiConfig.headers.authorization.password = '';

    expect(wrappedCreateAccuwareApi).to.throw(Error);
  });

  it('should include error messages for each missing username and password error thrown', function () {
    apiConfig.headers.authorization.password = '';
    apiConfig.headers.authorization.username = '';

    try {
      wrappedCreateAccuwareApi();
    } catch (error) {
      const errorMessages = error.message.split(';');
      expect(errorMessages.length).to.equal(2);
    }
  });
});

