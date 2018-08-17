
const { getConfigForEnvironment } = require('../config/config.js');
const DiContainerStamp = require('./di_container');
const AccuwareApiStampFactory = require('../services/accuware_api');
const BaseApiStampFactory = require('../services/base_api');
const stampit = require('stampit');
const { EventEmitter } = require('events');

const wireUpApp = () => {
  const diContainer = DiContainerStamp();

  const config = getConfigForEnvironment(process.env.NODE_ENV);

  const apiConfig = config.accuwareApi.baseConfig;

  diContainer.registerDependency('apiConfig', apiConfig);

  diContainer.registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);

  diContainer.registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);

  const EventEmittable = stampit.composers(({ stamp }) => {
    stamp.compose.methods = stamp.compose.methods || {}; // make sure it exists
    Object.setPrototypeOf(stamp.compose.methods, EventEmitter.prototype);
  });

  const eventEmittable = EventEmittable();
};

module.exports = { wireUpApp };
