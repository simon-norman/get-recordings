
const { getConfigForEnvironment } = require('../config/config.js');
const DiContainerStamp = require('./di_container');
const AccuwareApiStampFactory = require('../services/accuware_api');
const BaseApiStampFactory = require('../services/base_api');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');
const FunctionPollerStampFactory = require('../services/function_poller');
const AccuwareRecordingsConverterStampFactory = require('../services/accuware_recordings_converter');
const Recording = require('../models/recording');
const RecordingControllerStampFactory = require('../controllers/recording_controller');

const wireUpApp = () => {
  const diContainer = DiContainerStamp();

  const config = getConfigForEnvironment(process.env.NODE_ENV);

  const apiConfig = config.accuwareApi.baseConfig;

  diContainer.registerDependency('apiConfig', apiConfig);

  diContainer.registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);

  diContainer.registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);

  diContainer.registerDependency('EventEmittableStamp', EventEmittableStamp);

  diContainer.registerDependencyFromFactory('FunctionPollerStamp', FunctionPollerStampFactory);

  diContainer.registerDependencyFromFactory('AccuwareRecordingsConverterStamp', AccuwareRecordingsConverterStampFactory);

  diContainer.registerDependency('Recording', Recording);

  diContainer.registerDependencyFromFactory('RecordingControllerStamp', RecordingControllerStampFactory);

  return diContainer;
};

module.exports = { wireUpApp };
