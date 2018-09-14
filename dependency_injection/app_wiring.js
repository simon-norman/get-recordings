
const DependencyNotFoundError = require('../services/error_handling/errors/DependencyNotFoundError.js');
const DependencyAlreadyRegisteredError = require('../services/error_handling/errors/DependencyAlreadyRegisteredError');
const DiContainerStampFactory = require('./di_container');
const { getConfigForEnvironment } = require('../config/config.js');
const RecoverableInvalidRecordingError = require('../services/error_handling/errors/RecoverableInvalidRecordingError');
const InvalidTimestampInRecordingError = require('../services/error_handling/errors/InvalidTimestampInRecordingError.js');
const LoggerFactory = require('../services/error_handling/logger/logger.js');
const AccuwareApiStampFactory = require('../services/recordings_retrieval/accuware_api');
const BaseApiStampFactory = require('../helpers/base_api/base_api');
const EventEmittableStamp = require('../helpers/event_generation/event_emittable_stamp');
const FunctionPollerStampFactory = require('../services/function_poller/function_poller');
const RecordingsWriterForUsageAnalysisStampFactory = require('../services/recordings_conversion_and_storage/recordings_writer_for_usage_analysis');
const UnconvertedRecordingsGetterStampFactory = require('../services/recordings_retrieval/unconverted_recordings_getter');
const AccuwareRecordingConverterStampFactory = require('../services/recordings_conversion_and_storage/accuware_recording_converter');
const MonitoredSitesRegisterStampFactory = require('../services/sites_register/monitored_sites_register');
const DeviceInfo = require('../models/device_info');
const DeviceInfoControllerStampFactory = require('../controllers/device_info_controller');
const Recording = require('../models/recording');
const RecordingControllerStampFactory = require('../controllers/recording_controller');

let diContainer;

const registerErrors = () => {
  diContainer.registerDependency('RecoverableInvalidRecordingError', RecoverableInvalidRecordingError);
  diContainer.registerDependency('InvalidTimestampInRecordingError', InvalidTimestampInRecordingError);
};

const registerAccuwareApi = () => {
  const config = getConfigForEnvironment(process.env.NODE_ENV);
  const apiConfig = config.accuwareApi.baseConfig;
  diContainer.registerDependency('apiConfig', apiConfig);

  diContainer.registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);
  diContainer.registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);
};

const registerFunctionPoller = () => {
  diContainer.registerDependencyFromFactory('FunctionPollerStamp', FunctionPollerStampFactory);
};

const registerRecordingConverter = () => {
  diContainer.registerDependencyFromFactory('AccuwareRecordingConverterStamp', AccuwareRecordingConverterStampFactory);
  const AccuwareRecordingConverterStamp = diContainer.getDependency('AccuwareRecordingConverterStamp');
  diContainer.registerDependency('accuwareRecordingConverter', AccuwareRecordingConverterStamp());
};

const registerRecordingController = () => {
  diContainer.registerDependency('Recording', Recording);
  diContainer.registerDependencyFromFactory('RecordingControllerStamp', RecordingControllerStampFactory);
  const RecordingControllerStamp = diContainer.getDependency('RecordingControllerStamp');
  diContainer.registerDependency('recordingController', RecordingControllerStamp());
};

const registerDeviceInfoController = () => {
  diContainer.registerDependency('DeviceInfo', DeviceInfo);
  diContainer.registerDependencyFromFactory('DeviceInfoControllerStamp', DeviceInfoControllerStampFactory);
  const DeviceInfoControllerStamp = diContainer.getDependency('DeviceInfoControllerStamp');
  diContainer.registerDependency('deviceInfoController', DeviceInfoControllerStamp());
};

const registerRecordingsWriterForUsageAnalysis = () => {
  diContainer.registerDependencyFromFactory('RecordingsWriterForUsageAnalysisStamp', RecordingsWriterForUsageAnalysisStampFactory);
  const RecordingsWriterForUsageAnalysisStamp = diContainer.getDependency('RecordingsWriterForUsageAnalysisStamp');
  const accuwareRecordingConverter = diContainer.getDependency('accuwareRecordingConverter');
  diContainer.registerDependency('recordingsWriterForUsageAnalysis', RecordingsWriterForUsageAnalysisStamp(accuwareRecordingConverter));
};

const registerUnconvertedRecordingsGetter = () => {
  diContainer.registerDependencyFromFactory('UnconvertedRecordingsGetterStamp', UnconvertedRecordingsGetterStampFactory);
  const UnconvertedRecordingsGetterStamp = diContainer.getDependency('UnconvertedRecordingsGetterStamp');
  diContainer.registerDependency('unconvertedRecordingsGetter', UnconvertedRecordingsGetterStamp());
};

const registerMonitoredSitesRegister = () => {
  diContainer.registerDependencyFromFactory('MonitoredSitesRegisterStamp', MonitoredSitesRegisterStampFactory);
  const MonitoredSitesRegisterStamp = diContainer.getDependency('MonitoredSitesRegisterStamp');
  diContainer.registerDependency('monitoredSitesRegister', MonitoredSitesRegisterStamp());
};

const wireUpApp = () => {
  const DiContainerStamp = DiContainerStampFactory(
    DependencyNotFoundError,
    DependencyAlreadyRegisteredError,
  );
  diContainer = DiContainerStamp();

  registerErrors();
  const logException = LoggerFactory(process.env.NODE_ENV);
  diContainer.registerDependency('logException', logException);

  registerAccuwareApi();
  diContainer.registerDependency('EventEmittableStamp', EventEmittableStamp);
  registerFunctionPoller();

  registerDeviceInfoController();
  registerRecordingConverter();
  registerRecordingController();
  registerRecordingsWriterForUsageAnalysis();
  registerUnconvertedRecordingsGetter();

  registerMonitoredSitesRegister();
  return diContainer;
};

module.exports = { wireUpApp };
