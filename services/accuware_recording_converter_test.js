

const { expect } = require('chai');
const AccuwareRecordingConverterStampFactory = require('./accuware_recording_converter');
const InvalidAccuwareRecordingError = require('../helpers/error_handling/errors/InvalidAccuwareRecordingError.js');

describe('accuware_recording_parser_test', () => {
  let mockAccuwareRecording;
  let timestampRecordingCaptured;
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
    timestampRecordingCaptured = Date();

    AccuwareRecordingConverterStamp =
      AccuwareRecordingConverterStampFactory(InvalidAccuwareRecordingError);
    accuwareRecordingConverter = AccuwareRecordingConverterStamp();
  });

  it('should convert accuware recording into format that can be used for usage analysis', function () {
    const convertedRecording = accuwareRecordingConverter
      .convertRecordingForUsageAnalysis(mockAccuwareRecording);

    expect(mockAccuwareRecording.mac).to.equal(convertedRecording.objectId);
    expect(mockAccuwareRecording.loc.lng).to.equal(convertedRecording.longitude);
    expect(mockAccuwareRecording.loc.lat).to.equal(convertedRecording.latitude);
    expect(mockAccuwareRecording.areas).to.deep.equal(convertedRecording.spaceIds);
  });

  it('should decorate recording with timestamp', async function () {
    const convertedRecording = accuwareRecordingConverter
      .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecordingCaptured);

    expect(timestampRecordingCaptured)
      .to.equal(convertedRecording.timestampRecorded);
  });

  it('should throw InvalidAccuwareRecording exception if recording location not provided', async function () {
    mockAccuwareRecording.loc = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecordingCaptured);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidAccuwareRecordingError);
  });

  it('should throw InvalidAccuwareRecording exception if recording longitude not provided', async function () {
    mockAccuwareRecording.loc.lng = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecordingCaptured);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidAccuwareRecordingError);
  });

  it('should throw InvalidAccuwareRecording exception if recording latitude not provided', async function () {
    mockAccuwareRecording.loc.lat = undefined;

    const wrappedAccuwareRecordingConverter = () => {
      accuwareRecordingConverter
        .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecordingCaptured);
    };

    expect(wrappedAccuwareRecordingConverter)
      .throw(InvalidAccuwareRecordingError);
  });
});

