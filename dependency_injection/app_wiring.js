
const { getConfigForEnvironment } = require('../config/config.js');
const DiContainerStamp = require('./di_container');
const AccuwareApiStampFactory = require('../services/accuware_api');
const BaseApiStampFactory = require('../services/base_api');

const wireUpApp = () => {
  const diContainer = DiContainerStamp();

  const config = getConfigForEnvironment(process.env.NODE_ENV);

  const apiConfig = config.accuwareApi.baseConfig;

  diContainer.registerDependency('apiConfig', apiConfig);

  diContainer.registerDependencyFromFactory('BaseApiStamp', BaseApiStampFactory);

  diContainer.registerDependencyFromFactory('AccuwareApiStamp', AccuwareApiStampFactory);
};

module.exports = { wireUpApp };
