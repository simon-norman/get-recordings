
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');
const { wrapperToHandleUnhandledExceptions } = require('./services/error_handling/logger/logger.js');
const mongoose = require('mongoose');

let config;
let diContainer;

const connectToDatabase = () =>
  mongoose.connect(config.trackingDatabase.uri, { useNewUrlParser: true });

const startApp = async () => {
  config = getConfigForEnvironment(process.env.NODE_ENV);
  diContainer = wireUpApp();

  try {
    await connectToDatabase();
  } catch (error) {
    console.log(error);
  }

  const monitoredSitesRegister = diContainer.getDependency('monitoredSitesRegister');

  monitoredSitesRegister.monitorSite(config.accuwareApi.getDeviceRecordings);
};


wrapperToHandleUnhandledExceptions(() => {
  startApp();
});
