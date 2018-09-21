
const { wireUpApp } = require('./dependency_injection/app_wiring');
const { getConfigForEnvironment } = require('./config/config.js');
const RavenWrapperFactory = require('raven-wrapper');
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

  monitoredSitesRegister.monitorSite({
    apiConfig: config.accuwareApi.baseConfig,
    siteConfig: config.accuwareApi.getDeviceRecordings,
  });
};

const errorLoggingConfig = getConfigForEnvironment(process.env.NODE_ENV).errorLogging;
errorLoggingConfig.environment = process.env.NODE_ENV;

const { wrapperToHandleUnhandledExceptions } = RavenWrapperFactory(errorLoggingConfig);
wrapperToHandleUnhandledExceptions(() => {
  startApp();
});
