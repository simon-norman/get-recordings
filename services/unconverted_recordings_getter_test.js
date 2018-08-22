const { expect } = require('chai');
const sinon = require('sinon');
const { EventEmitter } = require('events');

const UnconvertedRecordingsGetterStampFactory = require('./unconverted_recordings_getter');


describe('unconverted_recordings_getter', function () {
  let UnconvertedRecordingsGetterStamp;
  let stubbedSaveRecordingsInUsageAnalysisFormat;
  let mockRecordingsWriterForUsageAnalysis;
  let unconvertedRecordingsGetter;

  const setUpMockRecordingsWriterForUsageAnalysis = () => {
    stubbedSaveRecordingsInUsageAnalysisFormat = sinon.stub();
    mockRecordingsWriterForUsageAnalysis = {
      saveRecordingsInUsageAnalysisFormat: stubbedSaveRecordingsInUsageAnalysisFormat,
    };
  };

  beforeEach(() => {
    setUpMockRecordingsWriterForUsageAnalysis();
    UnconvertedRecordingsGetterStamp =
      UnconvertedRecordingsGetterStampFactory(mockRecordingsWriterForUsageAnalysis);
    unconvertedRecordingsGetter = UnconvertedRecordingsGetterStamp();
  });

  describe('Get recordings from given API and pass returned recordings to be converted and saved', function () {
    it('should get recordings from given function and pass returned recordings to be converted and saved', function () {
      const mockGetRecordingsObject = new EventEmitter();
      const stubbedGetRecordingsFunction = sinon.stub();
      const mockRecordingsResponseEvent = 'devicerecordings';
      const mockRecordingsResponseData = { data: 'recordingsdata' };
      const mockRecordingsResponsePromise = new Promise((resolve) => {
        resolve(mockRecordingsResponseData);
      });

      unconvertedRecordingsGetter.startGettingUnconvertedRecordings(
        mockGetRecordingsObject,
        stubbedGetRecordingsFunction,
        mockRecordingsResponseEvent,
      );
      mockGetRecordingsObject.emit(mockRecordingsResponseEvent, mockRecordingsResponsePromise);

      setTimeout(() => {
        expect(stubbedGetRecordingsFunction.callCount).to.equal(1);
        expect(stubbedSaveRecordingsInUsageAnalysisFormat.callCount).to.equal(1);
        expect(stubbedSaveRecordingsInUsageAnalysisFormat.firstCall.calledWith)
          .to.equal(mockRecordingsResponseData.data);
      }, 50);
    });
  });
});
