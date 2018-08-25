const { expect } = require('chai');
const sinon = require('sinon');
const InvalidLocationInRecordingError = require('../error_handling/errors/InvalidLocationInRecordingError');
const RecordingsWriterForUsageAnalysisStampFactory = require('./recordings_writer_for_usage_analysis');


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
      InvalidLocationInRecordingError,
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
    it('should pass a group of recordings to be converted for usage analysis', function () {
      recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedConvertRecordingForUsageAnalysis.firstCall.args)
        .to.deep.equal([mockRecordings[0], mockTimestamp]);

      expect(stubbedConvertRecordingForUsageAnalysis.secondCall.args)
        .to.deep.equal([mockRecordings[1], mockTimestamp]);
    });

    it('should pass a group of converted recordings to be saved', function () {
      recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedSaveSingleRecording.firstCall.args[0])
        .to.equal(mockConvertedRecording);

      expect(stubbedSaveSingleRecording.secondCall.args[0])
        .to.equal(mockConvertedRecording);
    });

    it('should move onto converting & saving the next recording if it catches an InvalidLocationInRecording, logging the exception', function () {
      const invalidLocationInRecordingError = new InvalidLocationInRecordingError();
      stubbedConvertRecordingForUsageAnalysis.throws(invalidLocationInRecordingError);

      recordingsWriterForUsageAnalysis
        .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);

      expect(stubbedConvertRecordingForUsageAnalysis.secondCall.args)
        .to.deep.equal([mockRecordings[1], mockTimestamp]);

      const exceptionPassedToStubbedLogException = stubbedLogException.firstCall.args[0];
      expect(exceptionPassedToStubbedLogException).to.equal(invalidLocationInRecordingError);
    });

    it('should throw error if any other error encounterd', function () {
      stubbedConvertRecordingForUsageAnalysis.throws();

      const wrappedSaveRecordingsInUsageAnalysisFormat = () => {
        recordingsWriterForUsageAnalysis
          .saveRecordingsInUsageAnalysisFormat(mockRecordings, mockTimestamp);
      };

      expect(wrappedSaveRecordingsInUsageAnalysisFormat).throws();
    });
  });
});
