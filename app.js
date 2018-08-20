
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');

const diContainer = wireUpApp();

const config = getConfigForEnvironment(process.env.NODE_ENV);
const accuwareApiConfig = {
  siteId: config.accuwareApi.siteId,
  intervalPeriodInSeconds: 5,
  includeLocations: 'yes',
  devicesToInclude: 'all',
  areas: 'yes',
};

const AccuwareApiStamp = diContainer.getDependency('AccuwareApiStamp');
const accuwareApi = AccuwareApiStamp(accuwareApiConfig);

const FunctionPollerStamp = diContainer.getDependency('FunctionPollerStamp');
const functionPoller = FunctionPollerStamp();

const functionPollerConfig = {
  functionToPoll: accuwareApi.getDeviceLocations,
  functionResultEventName: 'devicelocations',
  pollingIntervalInMilSecs: 5000,
};

const AccuwareRecordingsConverterStamp = diContainer.getDependency('AccuwareRecordingsConverterStamp');
const accuwareRecordingsConverter = AccuwareRecordingsConverterStamp();

const RecordingControllerStamp = diContainer.getDependency('RecordingControllerStamp');
const recordingController = RecordingControllerStamp();

functionPoller.on(functionPollerConfig.functionResultEventName, (deviceLocations) => {
  console.log('new recording');
  const convertedRecordings =
    accuwareRecordingsConverter.convertRecordingsForUsageAnalysis(deviceLocations, Date());

  recordingController.saveRecordings(convertedRecordings);
});

functionPoller.pollFunction(functionPollerConfig);
