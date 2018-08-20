

const { expect } = require('chai');
const AccuwareRecordingsConverterStampFactory = require('./accuware_recordings_converter');

describe('accuware_recordings_parser_test', () => {
  let AccuwareRecordingsConverterStamp;
  let accuwareRecordingsConverter;
  let mockAccuwareRecordings;

  beforeEach(() => {
    mockAccuwareRecordings =
    [
      {
        mac: '485B39HAC5E9',
        loc: {
          lng: -117.114326,
          lat: 32.91186,
        },
        areas: ['7'],
      },
      {
        mac: '485B39HAC5E9',
        loc: {
          lng: -117.114326,
          lat: 32.91186,
        },
        areas: ['7'],
      },
    ];

    AccuwareRecordingsConverterStamp = AccuwareRecordingsConverterStampFactory();
    accuwareRecordingsConverter = AccuwareRecordingsConverterStamp();
  });

  it('should convert accuware recordings into format that can be used for usage analysis', function () {
    const convertedRecordings = accuwareRecordingsConverter
      .convertRecordingsForUsageAnalysis(mockAccuwareRecordings);

    expect(mockAccuwareRecordings[0].mac).to.equal(convertedRecordings[0].objectId);
    expect(mockAccuwareRecordings[0].loc.lng).to.equal(convertedRecordings[0].longitude);
    expect(mockAccuwareRecordings[0].loc.lat).to.equal(convertedRecordings[0].latitude);
    expect(mockAccuwareRecordings[0].areas).to.deep.equal(convertedRecordings[0].spaceIds);

    expect(mockAccuwareRecordings[0].mac).to.equal(convertedRecordings[1].objectId);
    expect(mockAccuwareRecordings[0].loc.lng).to.equal(convertedRecordings[1].longitude);
    expect(mockAccuwareRecordings[0].loc.lat).to.equal(convertedRecordings[1].latitude);
    expect(mockAccuwareRecordings[0].areas).to.deep.equal(convertedRecordings[1].spaceIds);
  });

  it('should decorate recordings with timestamp', async function () {
    const timestampRecordingsCaptured = Date();

    const convertedRecordings = accuwareRecordingsConverter
      .convertRecordingsForUsageAnalysis(mockAccuwareRecordings, timestampRecordingsCaptured);

    expect(timestampRecordingsCaptured)
      .to.equal(convertedRecordings[0].timestampRecorded);
    expect(timestampRecordingsCaptured)
      .to.equal(convertedRecordings[1].timestampRecorded);
  });
});

