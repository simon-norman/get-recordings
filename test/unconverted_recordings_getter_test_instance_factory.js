
const DependencyNotFoundError = require('../services/error_handling/errors/DependencyNotFoundError.js');
const DependencyAlreadyRegisteredError = require('../services/error_handling/errors/DependencyAlreadyRegisteredError');
const DiContainerStampFactory = require('../dependency_injection/di_container');
const testingConfig = require('./testing_config');
const RecoverableInvalidRecordingError = require('../services/error_handling/errors/RecoverableInvalidRecordingError');
const InvalidTimestampInRecordingError = require('../services/error_handling/errors/InvalidTimestampInRecordingError.js');
const BaseApiStampFactory = require('../helpers/base_api/base_api');
const RetryEnabledApiStampFactory = require('../helpers/base_api/retry_enabled_api');
const RecordingApiStampFactory = require('../services/recordings_conversion_and_storage/recording_api');
const AccuwareApiStampFactory = require('../services/recordings_retrieval/accuware_api');
const EventEmittableStamp = require('../helpers/event_generation/event_emittable_stamp');
const FunctionPollerFactory = require('../services/function_poller/function_poller');
const RecordingsWriterForUsageAnalysisStampFactory = require('../services/recordings_conversion_and_storage/recordings_writer_for_usage_analysis');
const UnconvertedRecordingsGetterFactory = require('../services/recordings_retrieval/unconverted_recordings_getter');
const AccuwareRecordingConverterStampFactory = require('../services/recordings_conversion_and_storage/accuware_recording_converter');
const DeviceInfo = require('../models/device_info');
const DeviceInfoControllerStampFactory = require('../controllers/device_info_controller');
const sinon = require('sinon');
const mongoose = require('mongoose');

let diContainer;
let registerDependency;
let registerDependencyFromFactory;
let getDependency;
let accuwareApi;
let recordingApi;

const getFunctionsFromDiContainer = () => {
  ({
    registerDependency,
    registerDependencyFromFactory,
    getDependency,
  } = diContainer);

  registerDependency = registerDependency.bind(diContainer);
  registerDependencyFromFactory = registerDependencyFromFactory.bind(diContainer);
  getDependency = getDependency.bind(diContainer);
};

const setUpDiContainer = () => {
  const DiContainerStamp = DiContainerStampFactory(
    DependencyNotFoundError,
    DependencyAlreadyRegisteredError,
  );

  diContainer = DiContainerStamp();
  getFunctionsFromDiContainer();
};

const registerErrors = () => {
  registerDependency('RecoverableInvalidRecordingError', RecoverableInvalidRecordingError);
  registerDependency('InvalidTimestampInRecordingError', InvalidTimestampInRecordingError);
};

const registerAccuwareApi = () => {
  const apiConfig = testingConfig.accuwareApi;

  const AccuwareApiStamp = registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);
  accuwareApi = AccuwareApiStamp({ apiConfig });
  registerDependency('accuwareApi', accuwareApi);
};

const registerRecordingApi = () => {
  registerDependency('recordingsApiAccessTokenConfig', testingConfig.recordingApi.recordingsApiAccessTokenConfig);
  const RecordingApiStamp = registerDependencyFromFactory('RecordingApiStamp', RecordingApiStampFactory);

  const recordingApiConfig = testingConfig.recordingApi.baseConfig;
  recordingApi = RecordingApiStamp({ apiConfig: recordingApiConfig });
  registerDependency('recordingApi', recordingApi);
};


const registerApis = () => {
  registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);
  registerDependencyFromFactory('RetryEnabledApiStamp', RetryEnabledApiStampFactory);

  registerAccuwareApi();
  registerRecordingApi();
};

const registerFunctionPoller = () => {
  registerDependency('FunctionPollerFactory', FunctionPollerFactory);
};

const registerRecordingConverter = () => {
  registerDependencyFromFactory('AccuwareRecordingConverterStamp', AccuwareRecordingConverterStampFactory);
  const AccuwareRecordingConverterStamp = getDependency('AccuwareRecordingConverterStamp');
  registerDependency('accuwareRecordingConverter', AccuwareRecordingConverterStamp());
};

const registerDeviceInfoController = () => {
  mongoose.connect(testingConfig.recordingDatabase.uri, { useNewUrlParser: true });

  registerDependency('DeviceInfo', DeviceInfo);
  registerDependencyFromFactory('DeviceInfoControllerStamp', DeviceInfoControllerStampFactory);
  const DeviceInfoControllerStamp = getDependency('DeviceInfoControllerStamp');
  registerDependency('deviceInfoController', DeviceInfoControllerStamp());
};

const registerRecordingsWriterForUsageAnalysis = () => {
  registerDependencyFromFactory('RecordingsWriterForUsageAnalysisStamp', RecordingsWriterForUsageAnalysisStampFactory);
  const RecordingsWriterForUsageAnalysisStamp = getDependency('RecordingsWriterForUsageAnalysisStamp');
  const accuwareRecordingConverter = getDependency('accuwareRecordingConverter');
  registerDependency('recordingsWriterForUsageAnalysis', RecordingsWriterForUsageAnalysisStamp(accuwareRecordingConverter));
};

const registerUnconvertedRecordingsGetter = () =>
  registerDependencyFromFactory('unconvertedRecordingsGetter', UnconvertedRecordingsGetterFactory);

const newUnconvertedRecordingsGetter = async () => {
  setUpDiContainer();

  registerErrors();

  registerDependency('logException', sinon.spy());

  registerApis();
  registerDependency('EventEmittableStamp', EventEmittableStamp);
  registerFunctionPoller();

  registerDeviceInfoController();
  registerRecordingConverter();
  registerRecordingsWriterForUsageAnalysis();
  const unconvertedRecordingsGetter = registerUnconvertedRecordingsGetter();

  return { unconvertedRecordingsGetter, recordingApi, accuwareApi };
};

module.exports = newUnconvertedRecordingsGetter;
