
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');
const mongoose = require('mongoose');

let config;
let diContainer;
let accuwareApi;
let functionPollerConfig;
let functionPoller;
let accuwareRecordingConverter;
let recordingController;

const connectToDatabase = () =>
  mongoose.connect(config.trackingDatabase.uri, { useNewUrlParser: true });

const setUpAccuwareApi = () => {
  const accuwareApiConfig = config.accuwareApi.getDeviceLocations;
  const AccuwareApiStamp = diContainer.getDependency('AccuwareApiStamp');
  accuwareApi = AccuwareApiStamp(accuwareApiConfig);
};

const getComponentsToSaveRecordings = () => {
  accuwareRecordingConverter = diContainer.getDependency('accuwareRecordingConverter');
  recordingController = diContainer.getDependency('recordingController');
};


const saveSingleRecordingInUsageAnalysisFormat = (accuwareRecording, timestampRecorded) => {
  const convertedRecording = accuwareRecordingConverter
    .convertRecordingForUsageAnalysis(accuwareRecording, timestampRecorded);

  recordingController.saveSingleRecording(convertedRecording);
};

const saveRecordingsInUsageAnalysisFormat = (accuwareRecordings) => {
  const timestampRecorded = Date.now();
  const InvalidLocationInRecordingError = diContainer.getDependency('InvalidLocationInRecordingError');
  for (const accuwareRecording of accuwareRecordings) {
    try {
      saveSingleRecordingInUsageAnalysisFormat(accuwareRecording, timestampRecorded);
    } catch (error) {
      if (error instanceof InvalidLocationInRecordingError) {
        continue;
      } else {
        console.log(error);
        process.exit();
      }
    }
  }
};

const startFunctionPoller = () => {
  functionPoller = diContainer.getDependency('functionPoller');
  functionPoller.on(functionPollerConfig.functionResultEventName, (accuwareApiCallPromise) => {
    handleApiResponse(accuwareApiCallPromise);
  });

  functionPoller.pollFunction(functionPollerConfig);
};


const startTrackApiCalls = () => {
  functionPollerConfig = {
    functionToPoll: accuwareApi.getDeviceLocations.bind(accuwareApi),
    functionResultEventName: 'devicelocations',
    pollingIntervalInMilSecs: 5000,
  };

  startFunctionPoller();
};

const startApp = async () => {
  config = getConfigForEnvironment(process.env.NODE_ENV);
  diContainer = wireUpApp();

  try {
    await connectToDatabase();
  } catch (error) {
    console.log(error);
  }

  getComponentsToSaveRecordings();

  setUpAccuwareApi();

  startTrackApiCalls();
};

startApp();
