
const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const RecordingApiStampFactory = require('./recording_api.js');


describe('recording_api', () => {
  let mockAccessToken;
  let mockRecordings;
  let mockSavedRecordings;
  let postStub;
  let MockRetryEnabledApiStamp;
  let recordingsCallParams;
  let RecordingApiStamp;
  let recordingApi;

  const setUpMockRetryEnabledApi = () => {
    postStub = sinon.stub();
    MockRetryEnabledApiStamp = stampit({
      init() {
        this.post = postStub;
      },
    });
  };

  const setUpMockAccessTokenApi = () => {
    mockAccessToken = {
      data: {
        token_type: 'json',
        access_token: 'some access token',
      },
    };
    postStub.onCall(0).returns(mockAccessToken);
  };

  const setUpMockRecordingsApiEndpoint = () => {
    mockSavedRecordings = 'saved recordings';
    postStub.onCall(1).returns(mockSavedRecordings);
  };

  const setUpTests = () => {
    setUpMockRetryEnabledApi();

    setUpMockAccessTokenApi();

    setUpMockRecordingsApiEndpoint();

    const mockRecordingsApiAccessTokenConfig = {
      accessTokenServerUrl: 'https://fakeurl.com',
      credentialsToGetAccessToken: 'fake credentials',
    };

    mockRecordings = [{ recordingData: 'data1' }, { recordingData: 'data2' }];

    RecordingApiStamp
      = RecordingApiStampFactory(MockRetryEnabledApiStamp, mockRecordingsApiAccessTokenConfig);
    recordingApi = RecordingApiStamp();
  };

  describe('Get device recordings successfully', () => {
    beforeEach(() => {
      setUpTests();
    });

    it('should call recording api with specified parameters', async () => {
      await recordingApi.saveRecordings(mockRecordings);

      expect(postStub.secondCall.args).deep.equals([
        '/recordings',
        mockRecordings,
        {
          headers: {
            authorization: `${mockAccessToken.data.token_type} ${mockAccessToken.data.access_token}`,
          },
        },
      ]);
    });

    it('should return the result', async () => {
      const response = await recordingApi.saveRecordings(recordingsCallParams);

      expect(response).to.equal(mockSavedRecordings);
    });
  });

  describe('Errors when creating recording api stamp', () => {
    it('should throw error if retry enabled api stamp not provided', async () => {
      const createStampWithoutParameters = () => {
        RecordingApiStampFactory();
      };

      expect(createStampWithoutParameters).to.throw(Error);
    });
  });
});

