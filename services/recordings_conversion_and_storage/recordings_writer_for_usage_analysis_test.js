const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const RecoverableInvalidRecordingError = require('../error_handling/errors/RecoverableInvalidRecordingError');
const RecordingsWriterForUsageAnalysisStampFactory = require('./recordings_writer_for_usage_analysis');

chai.use(chaiAsPromised);
const { expect } = chai;


describe('recordings_writer_for_usage_analysis', function () {
  let stubbedSaveSingleRecording;
  let mockRecordingController;
  let RecordingsWriterForUsageAnalysisStamp;
  let mockConvertedRecording;
  let stubbedLogException;
  let stubbedConvertRecordingForUsageAnalysis;
  let mockRecordingConverter;
  let recordingsWriterForUsageAnalysis;
  let mockRecordings;
  let mockTimestamp;

  const setUpMockRecordingController = () => {
    stubbedSaveSingleRecording = sinon.stub();

    mockRecordingController = {
      saveSingleRecording: stubbedSaveSingleRecording,
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
      mockRecordingController,
      RecoverableInvalidRecordingError,
      stubbedLogException,
    );

    recordingsWriterForUsageAnalysis =
      RecordingsWriterForUsageAnalysisStamp(mockRecordingConverter);
  };

  beforeEach(() => {
    setUpMockRecordingController();

    setUpMockRecordingConverter();

    stubbedLogException = sinon.stub();
    setUpRecordingsWriterForUsageAnalysis();

    mockRecordings = [{ recordingData: 'data1' }, { recordingData: 'data2' }];
    mockTimestamp = 'timestamp';
  });

  describe('Loop through recordings and convert and save each one for usage analysis', function () {
    it('should pass a group of recordings to be converted for usage analysis', async function () {
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

      expect(stubbedSaveSingleRecording.firstCall.args[0])
        .to.equal(mockConvertedRecording);

      expect(stubbedSaveSingleRecording.secondCall.args[0])
        .to.equal(mockConvertedRecording);
    });

    it('should move onto converting & saving the next recording if it catches an RecoverableInvalidRecordingError, logging the exception', async function () {
      const recoverableInvalidRecordingError = new RecoverableInvalidRecordingError();
      stubbedConvertRecordingForUsageAnalysis.throws(recoverableInvalidRecordingError);

      await recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedConvertRecordingForUsageAnalysis.secondCall.args)
        .to.deep.equal([mockRecordings[1], mockTimestamp]);

      const exceptionPassedToStubbedLogException = stubbedLogException.firstCall.args[0];
      expect(exceptionPassedToStubbedLogException).to.equal(recoverableInvalidRecordingError);
    });

    it('should throw error if any other error encounterd', async function () {
      stubbedConvertRecordingForUsageAnalysis.throws();

      return expect(recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp))
        .to.be.rejected;
    });
  });
});
