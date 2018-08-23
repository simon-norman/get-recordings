

const { expect } = require('chai');
const AccuwareRecordingConverterStampFactory = require('./accuware_recording_converter');
const InvalidLocationInRecordingError = require('../../helpers/error_handling/errors/InvalidLocationInRecordingError.js');
const InvalidTimestampInRecordingError = require('../../helpers/error_handling/errors/InvalidTimestampInRecordingError.js');

describe('accuware_recording_parser_test', () => {
  let mockAccuwareRecording;
  let timestampRecorded;
  let AccuwareRecordingConverterStamp;
  let accuwareRecordingConverter;

  beforeEach(() => {
    mockAccuwareRecording =
      {
        mac: '485B39HAC5E9',
        loc: {
          lng: -117.114326,
          lat: 32.91186,
        },
        areas: ['7'],
      };
    timestampRecorded = Date.now();

    AccuwareRecordingConverterStamp = AccuwareRecordingConverterStampFactory(
      InvalidLocationInRecordingError,
      InvalidTimestampInRecordingError,
    );
    accuwareRecordingConverter = AccuwareRecordingConverterStamp();
  });

  it('should convert accuware recording into format that can be used for usage analysis', function () {
    const convertedRecording = accuwareRecordingConverter
      .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);

    expect(mockAccuwareRecording.mac).to.equal(convertedRecording.objectId);
    expect(mockAccuwareRecording.loc.lng).to.equal(convertedRecording.longitude);
    expect(mockAccuwareRecording.loc.lat).to.equal(convertedRecording.latitude);
    expect(mockAccuwareRecording.areas).to.deep.equal(convertedRecording.spaceIds);
  });

  it('should decorate recording with timestamp', async function () {
    const convertedRecording = accuwareRecordingConverter
      .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);

    expect(timestampRecorded)
      .to.equal(convertedRecording.timestampRecorded);
  });

  it('should throw InvalidLocationInRecordingError exception if recording location not provided', async function () {
    mockAccuwareRecording.loc = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidLocationInRecordingError);
  });

  it('should throw InvalidLocationInRecordingError exception if recording longitude not provided', async function () {
    mockAccuwareRecording.loc.lng = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidLocationInRecordingError);
  });

  it('should throw InvalidLocationInRecordingError exception if recording latitude not provided', async function () {
    mockAccuwareRecording.loc.lat = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidLocationInRecordingError);
  });

  it('should throw InvalidTimestampInRecordingError exception if timestampRecorded missing', async function () {
    timestampRecorded = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidTimestampInRecordingError);
  });

  it('should throw InvalidTimestampInRecordingError exception if timestampRecorded is not a number', async function () {
    timestampRecorded = 'not a number';

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidTimestampInRecordingError);
  });
});

