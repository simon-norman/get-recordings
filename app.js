
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');
const LoggerFactory = require('./services/error_handling/logger/logger.js');
const mongoose = require('mongoose');
const express = require('express');

let config;
let diContainer;

const setUpWebServer = () => {
  const app = express();

  app.listen(config.webServer.port);
};

const connectToDatabase = () =>
  mongoose.connect(config.recordingDatabase.uri, { useNewUrlParser: true });

const startApp = async () => {
  config = getConfigForEnvironment(process.env.NODE_ENV);
  diContainer = wireUpApp();

  setUpWebServer();

  try {
    await connectToDatabase();
  } catch (error) {
    console.log(error);
  }

  const monitoredSitesRegister = diContainer.getDependency('monitoredSitesRegister');

  monitoredSitesRegister.monitorSite(config.accuwareApi.getDeviceRecordings);
};

const { wrapperToHandleUnhandledExceptions } = LoggerFactory(process.env.NODE_ENV);
wrapperToHandleUnhandledExceptions(() => {
  startApp();
});
