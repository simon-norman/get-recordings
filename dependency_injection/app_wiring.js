
const DependencyNotFoundError = require('../helpers/error_handling/errors/DependencyNotFoundError.js');
const DiContainerStampFactory = require('./di_container');
const { getConfigForEnvironment } = require('../config/config.js');
const AccuwareApiStampFactory = require('../services/accuware_api');
const BaseApiStampFactory = require('../services/base_api');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');
const FunctionPollerStampFactory = require('../services/function_poller');
const InvalidAccuwareRecordingError = require('../helpers/error_handling/errors/InvalidAccuwareRecordingError');
const AccuwareRecordingConverterStampFactory = require('../services/accuware_recording_converter');
const Recording = require('../models/recording');
const RecordingControllerStampFactory = require('../controllers/recording_controller');

let diContainer;

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

const registerSaveRecordingComponents = () => {
  diContainer.registerDependency('InvalidAccuwareRecordingError', InvalidAccuwareRecordingError);
  diContainer.registerDependencyFromFactory('AccuwareRecordingConverterStamp', AccuwareRecordingConverterStampFactory);

  diContainer.registerDependency('Recording', Recording);
  diContainer.registerDependencyFromFactory('RecordingControllerStamp', RecordingControllerStampFactory);
};

const wireUpApp = () => {
  const DiContainerStamp = DiContainerStampFactory(DependencyNotFoundError);
  diContainer = DiContainerStamp();

  registerAccuwareApi();
  diContainer.registerDependency('EventEmittableStamp', EventEmittableStamp);
  registerFunctionPoller();
  registerSaveRecordingComponents();

  return diContainer;
};

module.exports = { wireUpApp };
