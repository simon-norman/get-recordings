
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');
const mongoose = require('mongoose');

const diContainer = wireUpApp();

const config = getConfigForEnvironment(process.env.NODE_ENV);
const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.trackingDatabase.uri, { useNewUrlParser: true });
  } catch (error) {
    console.log(error);
  }
};
connectToDatabase();


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

const AccuwareRecordingConverterStamp = diContainer.getDependency('AccuwareRecordingConverterStamp');
const accuwareRecordingConverter = AccuwareRecordingConverterStamp();

const RecordingControllerStamp = diContainer.getDependency('RecordingControllerStamp');
const recordingController = RecordingControllerStamp();

functionPoller.on(functionPollerConfig.functionResultEventName, (accuwareApiCallPromise) => {
  accuwareApiCallPromise
    .then((accuwareApiResponse) => {
      const accuwareRecordings = accuwareApiResponse.data;

      const InvalidAccuwareRecordingError = diContainer.getDependency('InvalidAccuwareRecordingError');
      for (const accuwareRecording of accuwareRecordings) {
        try {
          const convertedRecording = accuwareRecordingConverter
            .convertRecordingForUsageAnalysis(accuwareRecording, Date());
          recordingController.saveSingleRecording(convertedRecording);
        } catch (error) {
          if (error instanceof InvalidAccuwareRecordingError) {
            continue;
          } else {
            console.log(error);
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

functionPoller.pollFunction(functionPollerConfig);
