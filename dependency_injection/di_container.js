
const parseFunctionArgs = require('parse-fn-args');
const stampit = require('stampit');

const dependencies = {};

const registerDependency = (name, dependency) => {
  if (dependencies[name]) {
    throw new Error('A dependency with this name has already been registered, therefore new dependency has not been registered');
  }
  dependencies[name] = dependency;
};

const getDependency = (name) => {
  if (dependencies[name]) {
    return dependencies[name];
  }
  throw new Error('The requested dependency could not be found');
};

const getDependenciesOfFactory = (factory) => {
  const dependenciesOfFactory = parseFunctionArgs(factory)
    .map(dependencyName => getDependency(dependencyName));
  return dependenciesOfFactory;
};

const registerDependencyFromFactory = (name, factory) => {
  const dependenciesOfFactory = getDependenciesOfFactory(factory);
  const dependencyFromFactory = factory(...dependenciesOfFactory);

  dependencies[name] = dependencyFromFactory;
};

module.exports = {
  registerDependency, getDependency, registerDependencyFromFactory,
};
