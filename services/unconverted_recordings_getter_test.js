const { expect } = require('chai');
const sinon = require('sinon');
const { EventEmitter } = require('events');

const UnconvertedRecordingsGetterStampFactory = require('./unconverted_recordings_getter');


describe('unconverted_recordings_getter', function () {
  let UnconvertedRecordingsGetterStamp;
  let stubbedSaveRecordingsInUsageAnalysisFormat;
  let mockRecordingsWriterForUsageAnalysis;
  let unconvertedRecordingsGetter;
  let mockGetRecordingsObject;
  let stubbedGetRecordingsFunction;
  let mockRecordingsResponseEvent;
  let mockRecordingsResponseData;
  let mockRecordingsResponse;

  const setUpMockRecordingsWriterForUsageAnalysis = () => {
    stubbedSaveRecordingsInUsageAnalysisFormat = sinon.stub();
    mockRecordingsWriterForUsageAnalysis = {
      saveRecordingsInUsageAnalysisFormat: stubbedSaveRecordingsInUsageAnalysisFormat,
    };
  };

  const setUpMockGetRecordings = () => {
    mockGetRecordingsObject = new EventEmitter();
    stubbedGetRecordingsFunction = sinon.stub();
  };

  const setUpMockRecordingsResponse = () => {
    mockRecordingsResponseEvent = 'devicerecordings';
    mockRecordingsResponseData = { data: 'recordingsdata' };

    mockRecordingsResponse = {
      response: new Promise((resolve) => {
        resolve(mockRecordingsResponseData);
      }),
      timestampCallMade: '123435317',
    };
  };

  beforeEach(() => {
    setUpMockRecordingsWriterForUsageAnalysis();
    UnconvertedRecordingsGetterStamp =
      UnconvertedRecordingsGetterStampFactory(mockRecordingsWriterForUsageAnalysis);
    unconvertedRecordingsGetter = UnconvertedRecordingsGetterStamp();

    setUpMockRecordingsResponse();

    setUpMockGetRecordings();
  });

  describe('Get recordings from given API and pass returned recordings to be converted and saved', function () {
    it('should get recordings from given function and pass returned recordings to be converted and saved', function () {
      unconvertedRecordingsGetter.startGettingUnconvertedRecordings(
        mockGetRecordingsObject,
        stubbedGetRecordingsFunction,
        mockRecordingsResponseEvent,
      );
      mockGetRecordingsObject.emit(mockRecordingsResponseEvent, mockRecordingsResponse);

      setTimeout(() => {
        expect(stubbedGetRecordingsFunction.callCount).to.equal(1);
        expect(stubbedSaveRecordingsInUsageAnalysisFormat.callCount).to.equal(1);
        expect(stubbedSaveRecordingsInUsageAnalysisFormat.firstCall.calledWith)
          .to.equal(mockRecordingsResponseData.data, mockRecordingsResponse.timestampCallMade);
      }, 50);
    });
  });
});
