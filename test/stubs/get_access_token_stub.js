const sinon = require('sinon');

const stubGetAccessToken = (accessTokenApiWithConfig) => {
  const getAccessTokenStub = sinon.stub(accessTokenApiWithConfig.accessTokensGetter, 'post');

  const accessTokenForRecordingsApi = {
    data: {
      token_type: 'some_token_type', access_token: 'some token data',
    },
  };

  getAccessTokenStub.withArgs(
    accessTokenApiWithConfig.accessTokenApiUrl,
    accessTokenApiWithConfig.credentialsToGetAccessToken
  ).returns(accessTokenForRecordingsApi);

  return getAccessTokenStub;
};

module.exports = stubGetAccessToken;
