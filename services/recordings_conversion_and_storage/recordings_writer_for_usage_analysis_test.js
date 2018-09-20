const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const RecoverableInvalidRecordingError = require('../error_handling/errors/RecoverableInvalidRecordingError');
const RecordingsWriterForUsageAnalysisStampFactory = require('./recordings_writer_for_usage_analysis');

chai.use(chaiAsPromised);
const { expect } = chai;


describe('recordings_writer_for_usage_analysis', function () {
  let stubbedSaveRecordings;
  let mockRecordingApi;
  let RecordingsWriterForUsageAnalysisStamp;
  let mockConvertedRecording;
  let stubbedLogException;
  let stubbedConvertRecordingForUsageAnalysis;
  let mockRecordingConverter;
  let recordingsWriterForUsageAnalysis;
  let mockRecordings;
  let mockTimestamp;

  const recoverableInvalidRecordingError = new RecoverableInvalidRecordingError();

  const setUpMockRecordingApi = () => {
    stubbedSaveRecordings = sinon.stub();

    mockRecordingApi = {
      saveRecordings: stubbedSaveRecordings,
    };
  };

  const setUpMockRecordingConverter = () => {
    mockConvertedRecording = 'converted recording';
    stubbedConvertRecordingForUsageAnalysis = sinon.stub();
    stubbedConvertRecordingForUsageAnalysis.returns(mockConvertedRecording);

    mockRecordingConverter = {
      convertRecordingForUsageAnalysis: stubbedConvertRecordingForUsageAnalysis,
    };
  };

  const setUpRecordingsWriterForUsageAnalysis = () => {
    RecordingsWriterForUsageAnalysisStamp = RecordingsWriterForUsageAnalysisStampFactory(
      RecoverableInvalidRecordingError,
      stubbedLogException,
      mockRecordingApi,
    );

    recordingsWriterForUsageAnalysis =
      RecordingsWriterForUsageAnalysisStamp(mockRecordingConverter);
  };

  const getErrorFromFailingSaveRecordingsPromise = async () => {
    try {
      return await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);
    } catch (error) {
      return error;
    }
  };

  beforeEach(() => {
    setUpMockRecordingApi();

    setUpMockRecordingConverter();

    stubbedLogException = sinon.stub();
    setUpRecordingsWriterForUsageAnalysis();

    mockRecordings = [{ recordingData: 'data1' }, { recordingData: 'data2' }];
    mockTimestamp = 'timestamp';
  });

  describe('Convert and save recordings for usage analysis', function () {
    it('should pass recordings to be converted for usage analysis', async function () {
      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedConvertRecordingForUsageAnalysis.firstCall.args)
        .to.deep.equal([mockRecordings[0], mockTimestamp]);

      expect(stubbedConvertRecordingForUsageAnalysis.secondCall.args)
        .to.deep.equal([mockRecordings[1], mockTimestamp]);
    });

    it('should pass a group of converted recordings to be saved', async function () {
      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedSaveRecordings.firstCall.args[0])
        .deep.equals([mockConvertedRecording, mockConvertedRecording]);
    });

    it('should move onto converting the next recording if catches RecoverableInvalidRecordingError, logging the exception with level set to info', async function () {
      stubbedConvertRecordingForUsageAnalysis.throws(recoverableInvalidRecordingError);

      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedConvertRecordingForUsageAnalysis.secondCall.args)
        .to.deep.equal([mockRecordings[1], mockTimestamp]);

      const exceptionPassedToStubbedLogException = stubbedLogException.firstCall.args[0];
      expect(exceptionPassedToStubbedLogException).deep.equals([
        recoverableInvalidRecordingError,
        { level: 'info' },
      ]);
    });

    it('should, if convert some recordings but not others, continue to save the converted ones', async function () {
      stubbedConvertRecordingForUsageAnalysis.onCall(1).throws(recoverableInvalidRecordingError);

      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedSaveRecordings.calledOnceWithExactly([mockConvertedRecording])).equals(true);
    });

    it('should not attempt to save recordings if all recordings fail to convert', async function () {
      stubbedConvertRecordingForUsageAnalysis.throws(recoverableInvalidRecordingError);

      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedSaveRecordings.notCalled).equals(true);
    });

    it('should throw error if any other error encounterd when converting', async function () {
      stubbedConvertRecordingForUsageAnalysis.throws();

      return expect(recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp))
        .to.be.rejected;
    });

    it('should throw error if save recordings call fails', async function () {
      stubbedSaveRecordings.throws();

      return expect(recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp))
        .to.be.rejected;
    });

    it('should throw error if recording api response is an error, capturing the response', async function () {
      const errorMessageFromApi = 'error from api';
      const axiosHttpErrorResponse = {
        response: {
          data: {
            error: {
              message: errorMessageFromApi,
            },
          },
        },
      };

      stubbedSaveRecordings.returns(Promise.reject(axiosHttpErrorResponse));

      const thrownError = await getErrorFromFailingSaveRecordingsPromise();

      expect(thrownError.message).equals(errorMessageFromApi);
    });
  });
});
