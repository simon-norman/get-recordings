

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const AccuwareRecordingConverterStampFactory = require('./accuware_recording_converter');
const InvalidTimestampInRecordingError = require('../error_handling/errors/InvalidTimestampInRecordingError.js');
const RecoverableInvalidRecordingError = require('../error_handling/errors/RecoverableInvalidRecordingError');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('accuware_recording_converter', () => {
  let mockAccuwareRecording;
  let timestampRecorded;
  let AccuwareRecordingConverterStamp;
  let accuwareRecordingConverter;
  let mockDeviceInfo;
  let stubbedGetDeviceInfo;
  let mockDeviceInfoController;
  let convertedRecording;

  const setUpMockDeviceInfoController = () => {
    mockDeviceInfo = { estimatedDeviceCategory: 'Mobile phone' };
    stubbedGetDeviceInfo = sinon.stub();
    stubbedGetDeviceInfo.returns(mockDeviceInfo);

    mockDeviceInfoController = {
      getDeviceInfo: stubbedGetDeviceInfo,
    };
  };

  const setUpAccuwareRecordingConverter = () => {
    AccuwareRecordingConverterStamp = AccuwareRecordingConverterStampFactory(
      RecoverableInvalidRecordingError,
      InvalidTimestampInRecordingError,
      mockDeviceInfoController,
    );

    accuwareRecordingConverter = AccuwareRecordingConverterStamp();
  };

  const convertRecording = async () => {
    convertedRecording = await accuwareRecordingConverter
      .convertRecordingForUsageAnalysis(mockAccuwareRecording, timestampRecorded);
  };

  beforeEach(() => {
    mockAccuwareRecording = {
      mac: '485B39HAC5E9',
      loc: {
        lng: -117.114326,
        lat: 32.91186,
      },
      areas: [7],
    };

    timestampRecorded = Date.now();

    setUpMockDeviceInfoController();

    setUpAccuwareRecordingConverter();
  });

  it('should convert accuware recording into format that can be used for usage analysis', async function () {
    await convertRecording();

    expect(mockAccuwareRecording.mac).to.equal(convertedRecording.objectId);
    expect(mockAccuwareRecording.loc.lng).to.equal(convertedRecording.longitude);
    expect(mockAccuwareRecording.loc.lat).to.equal(convertedRecording.latitude);
    expect(mockAccuwareRecording.areas).to.deep.equal(convertedRecording.spaceIds);
  });

  it('should decorate recording with timestamp', async function () {
    await convertRecording();

    expect(convertedRecording.timestampRecorded)
      .to.equal(timestampRecorded);
  });

  it('should query device info using oui and decorate recording with device info', async function () {
    await convertRecording();

    const deviceOui = mockAccuwareRecording.mac.substr(0, 6);
    expect(stubbedGetDeviceInfo.calledOnceWithExactly(deviceOui)).to.equal(true);

    expect(convertedRecording.estimatedDeviceCategory)
      .to.deep.equal(mockDeviceInfo.estimatedDeviceCategory);
  });

  it('should throw RecoverableInvalidRecordingError when device info cannot be found', async function () {
    stubbedGetDeviceInfo.returns(undefined);

    return expect(convertRecording()).to.be.rejectedWith(RecoverableInvalidRecordingError);
  });

  it('should throw RecoverableInvalidRecordingError when device category is not mobile device', async function () {
    mockDeviceInfo.estimatedDeviceCategory = 'not mobile device';

    return expect(convertRecording()).to.be.rejectedWith(RecoverableInvalidRecordingError);
  });

  it('should throw RecoverableInvalidRecordingError exception if recording location not provided', async function () {
    mockAccuwareRecording.loc = undefined;

    return expect(convertRecording()).to.be.rejectedWith(RecoverableInvalidRecordingError);
  });

  it('should throw RecoverableInvalidRecordingError exception if recording longitude not provided', async function () {
    mockAccuwareRecording.loc.lng = undefined;

    return expect(convertRecording()).to.be.rejectedWith(RecoverableInvalidRecordingError);
  });

  it('should throw RecoverableInvalidRecordingError exception if recording latitude not provided', async function () {
    mockAccuwareRecording.loc.lat = undefined;

    return expect(convertRecording()).to.be.rejectedWith(RecoverableInvalidRecordingError);
  });

  it('should throw InvalidTimestampInRecordingError exception if timestampRecorded missing', async function () {
    timestampRecorded = undefined;

    return expect(convertRecording()).to.be.rejectedWith(InvalidTimestampInRecordingError);
  });

  it('should throw InvalidTimestampInRecordingError exception if timestampRecorded is not a number', async function () {
    timestampRecorded = 'not a number';

    return expect(convertRecording()).to.be.rejectedWith(InvalidTimestampInRecordingError);
  });
});

