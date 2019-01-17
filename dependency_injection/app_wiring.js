
const DependencyNotFoundError = require('../services/error_handling/errors/DependencyNotFoundError.js');
const DependencyAlreadyRegisteredError = require('../services/error_handling/errors/DependencyAlreadyRegisteredError');
const DiContainerStampFactory = require('./di_container');
const DiContainerInclStampsStampFactory = require('./di_container_incl_stamps');
const { getConfigForEnvironment } = require('../config/config.js');
const RecoverableInvalidRecordingError = require('../services/error_handling/errors/RecoverableInvalidRecordingError');
const InvalidTimestampInRecordingError = require('../services/error_handling/errors/InvalidTimestampInRecordingError.js');
const RavenWrapperFactory = require('raven-wrapper');
const BaseApiStampFactory = require('../helpers/base_api/base_api');
const RetryEnabledApiStampFactory = require('../helpers/base_api/retry_enabled_api');
const RecordingApiStampFactory = require('../services/recordings_conversion_and_storage/recording_api');
const AccuwareApiStampFactory = require('../services/recordings_retrieval/accuware_api');
const EventEmittableStamp = require('../helpers/event_generation/event_emittable_stamp');
const FunctionPollerStampFactory = require('../services/function_poller/function_poller');
const RecordingsWriterForUsageAnalysisStampFactory = require('../services/recordings_conversion_and_storage/recordings_writer_for_usage_analysis');
const UnconvertedRecordingsGetterStampFactory = require('../services/recordings_retrieval/unconverted_recordings_getter');
const AccuwareRecordingConverterStampFactory = require('../services/recordings_conversion_and_storage/accuware_recording_converter');
const MonitoredSitesRegisterStampFactory = require('../services/sites_register/monitored_sites_register');
const DeviceInfo = require('../models/device_info');
const DeviceInfoControllerStampFactory = require('../controllers/device_info_controller');

let diContainer;
let config;
let registerDependency;
let registerDependencyFromFactory;
let registerDependencyFromStampFactory;
let getDependency;
const environment = process.env.NODE_ENV;

const getFunctionsFromDiContainer = () => {
  ({
    registerDependency,
    registerDependencyFromFactory,
    registerDependencyFromStampFactory,
    getDependency,
  } = diContainer);

  registerDependency = registerDependency.bind(diContainer);
  registerDependencyFromFactory = registerDependencyFromFactory.bind(diContainer);
  registerDependencyFromStampFactory = registerDependencyFromStampFactory.bind(diContainer);
  getDependency = getDependency.bind(diContainer);
};

const setUpDiContainer = () => {
  const DiContainerStamp = DiContainerStampFactory(
    DependencyNotFoundError,
    DependencyAlreadyRegisteredError,
  );
  const DiContainerInclStampsStamp = DiContainerInclStampsStampFactory(DiContainerStamp);

  diContainer = DiContainerInclStampsStamp();
  getFunctionsFromDiContainer();
};

const registerErrors = () => {
  registerDependency('RecoverableInvalidRecordingError', RecoverableInvalidRecordingError);
  registerDependency('InvalidTimestampInRecordingError', InvalidTimestampInRecordingError);
};

const registerAccuwareApi = () => {
  const apiConfig = config.accuwareApi.baseConfig;
  registerDependency('apiConfig', apiConfig);

  registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);
};

const registerRecordingApi = () => {
  registerDependency('recordingsApiAccessTokenConfig', config.recordingApi.recordingsApiAccessTokenConfig);
  const RecordingApiStamp = registerDependencyFromFactory('RecordingApiStamp', RecordingApiStampFactory);

  const recordingApiConfig = config.recordingApi.baseConfig;
  const recordingApi = RecordingApiStamp({ apiConfig: recordingApiConfig });
  registerDependency('recordingApi', recordingApi);
};


const registerApis = () => {
  registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);
  registerDependencyFromFactory('RetryEnabledApiStamp', RetryEnabledApiStampFactory);

  registerAccuwareApi();

  registerRecordingApi();
};

const registerFunctionPoller = () => {
  registerDependencyFromFactory('FunctionPollerStamp', FunctionPollerStampFactory);
};

const registerRecordingConverter = () => {
  registerDependencyFromFactory('AccuwareRecordingConverterStamp', AccuwareRecordingConverterStampFactory);
  const AccuwareRecordingConverterStamp = getDependency('AccuwareRecordingConverterStamp');
  registerDependency('accuwareRecordingConverter', AccuwareRecordingConverterStamp());
};

const registerDeviceInfoController = () => {
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

const registerUnconvertedRecordingsGetter = () => {
  registerDependencyFromFactory('UnconvertedRecordingsGetterStamp', UnconvertedRecordingsGetterStampFactory);
  const UnconvertedRecordingsGetterStamp = getDependency('UnconvertedRecordingsGetterStamp');
  registerDependency('unconvertedRecordingsGetter', UnconvertedRecordingsGetterStamp());
};

const registerMonitoredSitesRegister = () => {
  registerDependencyFromFactory('MonitoredSitesRegisterStamp', MonitoredSitesRegisterStampFactory);
  const MonitoredSitesRegisterStamp = getDependency('MonitoredSitesRegisterStamp');
  registerDependency('monitoredSitesRegister', MonitoredSitesRegisterStamp());
};

const wireUpApp = () => {
  config = getConfigForEnvironment(environment);

  setUpDiContainer();

  registerErrors();

  const errorLoggingConfig = config.errorLogging;
  errorLoggingConfig.environment = environment;
  const { logException } = RavenWrapperFactory(errorLoggingConfig);
  registerDependency('logException', logException);

  registerApis();
  registerDependency('EventEmittableStamp', EventEmittableStamp);
  registerFunctionPoller();

  registerDeviceInfoController();
  registerRecordingConverter();
  registerRecordingsWriterForUsageAnalysis();
  registerUnconvertedRecordingsGetter();

  registerMonitoredSitesRegister();
  return diContainer;
};

module.exports = { wireUpApp };
