
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
  functionToPoll: accuwareApi.getDeviceLocations.bind(accuwareApi),
  functionResultEventName: 'devicelocations',
  pollingIntervalInMilSecs: 5000,
};

const AccuwareRecordingsConverterStamp = diContainer.getDependency('AccuwareRecordingsConverterStamp');
const accuwareRecordingsConverter = AccuwareRecordingsConverterStamp();

const RecordingControllerStamp = diContainer.getDependency('RecordingControllerStamp');
const recordingController = RecordingControllerStamp();

functionPoller.on(functionPollerConfig.functionResultEventName, (accuwareApiCallPromise) => {
  accuwareApiCallPromise
    .then((accuwareApiResponse) => {
      const convertedRecordings = accuwareRecordingsConverter
        .convertRecordingsForUsageAnalysis(accuwareApiResponse.data, Date());

      recordingController.saveRecordings(convertedRecordings);
    })
    .catch((error) => {
      console.log(error);
    });
});

functionPoller.pollFunction(functionPollerConfig);
