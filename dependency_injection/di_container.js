
const parseFunctionArgs = require('parse-fn-args');

const dependencies = {};
const factories = {};

const registerFactory = (name, factory) => {
  factories[name] = factory;
};

const registerDependency = ()