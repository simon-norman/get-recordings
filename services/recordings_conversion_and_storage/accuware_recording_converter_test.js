

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const AccuwareRecordingConverterStampFactory = require('./accuware_recording_converter');
const InvalidLocationInRecordingError = require('../error_handling/errors/InvalidLocationInRecordingError.js');
const InvalidTimestampInRecordingError = require('../error_handling/errors/InvalidTimestampInRecordingError.js');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('accuware_recording_converter', () => {
  let mockAccuwareRecording;
  let timestampRecorded;
  let logExceptionSpy;
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
    logExceptionSpy = sinon.spy();

    AccuwareRecordingConverterStamp = AccuwareRecordingConverterStampFactory(
      InvalidLocationInRecordingError,
      InvalidTimestampInRecordingError,
      mockDeviceInfoController,
      logExceptionSpy,
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

  it('should decorate recording with device info', async function () {
    await convertRecording();

    expect(convertedRecording.estimatedDeviceCategory)
      .to.deep.equal(mockDeviceInfo.estimatedDeviceCategory);
  });

  it('should log exception when device info cannot be found', async function () {
    const deviceInfoNotFound = new Error('No device info found');
    stubbedGetDeviceInfo.throws(deviceInfoNotFound);
    await convertRecording();

    expect(logExceptionSpy.calledOnceWithExactly(deviceInfoNotFound))
      .to.equal(true);
  });

  it('should throw InvalidLocationInRecordingError exception if recording location not provided', async function () {
    mockAccuwareRecording.loc = undefined;

    return expect(convertRecording()).to.be.rejectedWith(InvalidLocationInRecordingError);
  });

  it('should throw InvalidLocationInRecordingError exception if recording longitude not provided', async function () {
    mockAccuwareRecording.loc.lng = undefined;

    return expect(convertRecording()).to.be.rejectedWith(InvalidLocationInRecordingError);
  });

  it('should throw InvalidLocationInRecordingError exception if recording latitude not provided', async function () {
    mockAccuwareRecording.loc.lat = undefined;

    return expect(convertRecording()).to.be.rejectedWith(InvalidLocationInRecordingError);
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

