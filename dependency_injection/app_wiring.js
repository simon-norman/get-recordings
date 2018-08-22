
const DependencyNotFoundError = require('../helpers/error_handling/errors/DependencyNotFoundError.js');
const DiContainerStampFactory = require('./di_container');
const { getConfigForEnvironment } = require('../config/config.js');
const AccuwareApiStampFactory = require('../services/accuware_api');
const BaseApiStampFactory = require('../services/base_api');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');
const FunctionPollerStampFactory = require('../services/function_poller');
const InvalidLocationInRecordingError = require('../helpers/error_handling/errors/InvalidLocationInRecordingError');
const InvalidTimestampInRecordingError = require('../helpers/error_handling/errors/InvalidTimestampInRecordingError.js');
const RecordingsWriterForUsageAnalysisStampFactory = require('../services/recordings_writer_for_usage_analysis');
const AccuwareRecordingConverterStampFactory = require('../services/accuware_recording_converter');
const Recording = require('../models/recording');
const RecordingControllerStampFactory = require('../controllers/recording_controller');

let diContainer;

const registerErrors = () => {
  diContainer.registerDependency('InvalidLocationInRecordingError', InvalidLocationInRecordingError);
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
  const FunctionPollerStamp = diContainer.getDependency('FunctionPollerStamp');
  diContainer.registerDependency('functionPoller', FunctionPollerStamp());
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

const registerRecordingsWriterForUsageAnalysis = () => {
  diContainer.registerDependencyFromFactory('RecordingsWriterForUsageAnalysisStamp', RecordingsWriterForUsageAnalysisStampFactory);
  const RecordingsWriterForUsageAnalysisStamp = diContainer.getDependency('RecordingsWriterForUsageAnalysisStamp');
  diContainer.registerDependency('recordingsWriterForUsageAnalysis', RecordingsWriterForUsageAnalysisStamp());
};

const wireUpApp = () => {
  const DiContainerStamp = DiContainerStampFactory(DependencyNotFoundError);
  diContainer = DiContainerStamp();

  registerErrors();
  registerAccuwareApi();
  diContainer.registerDependency('EventEmittableStamp', EventEmittableStamp);
  registerFunctionPoller();
  registerRecordingConverter();
  registerRecordingController();
  registerRecordingsWriterForUsageAnalysis();

  return diContainer;
};

module.exports = { wireUpApp };
