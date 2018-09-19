
const { expect } = require('chai');
const sinon = require('sinon');
const stampit = require('stampit');

const RecordingApiStampFactory = require('./recording_api.js');


describe('recording_api', () => {
  let mockRecordings;
  let mockSavedRecordings;
  let postStub;
  let MockRetryEnabledApiStamp;
  let recordingsCallParams;
  let RecordingApiStamp;
  let recordingApi;

  const setUpMockRetryEnabledApi = () => {
    postStub = sinon.stub();
    mockSavedRecordings = 'saved recordings';
    postStub.returns(mockSavedRecordings);
    MockRetryEnabledApiStamp = stampit({
      init() {
        this.post = postStub;
      },
    });
  };

  const setUpTests = () => {
    setUpMockRetryEnabledApi();

    mockRecordings = [{ recordingData: 'data1' }, { recordingData: 'data2' }];

    RecordingApiStamp = RecordingApiStampFactory(MockRetryEnabledApiStamp);
    recordingApi = RecordingApiStamp();
  };

  describe('Get device recordings successfully', () => {
    beforeEach(() => {
      setUpTests();
    });

    it('should call recording api with specified parameters', async () => {
      await recordingApi.saveRecordings(mockRecordings);

      expect(postStub.calledWithExactly(
        '/recordings',
        mockRecordings
      )).to.equal(true);
    });

    it('should return the result', async () => {
      const response = recordingApi.saveRecordings(recordingsCallParams);

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

