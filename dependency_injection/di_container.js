
const parseFunctionArgs = require('parse-fn-args');
const stampit = require('stampit');

module.exports = DependencyNotFoundError => stampit({
  props: {
    DependencyNotFoundError,
  },

  init() {
    this.dependencies = {};
  },

  methods: {
    registerDependency(name, dependency) {
      if (this.dependencies[name]) {
        throw new Error('A dependency with this name has already been registered, therefore new dependency has not been registered');
      }
      this.dependencies[name] = dependency;
    },

    registerDependencyFromFactory(name, factory) {
      const dependenciesOfFactory = this.getDependenciesOfFactory(factory);
      const dependencyFromFactory = factory(...dependenciesOfFactory);

      this.dependencies[name] = dependencyFromFactory;
    },

    getDependenciesOfFactory(factory) {
      try {
        const dependenciesOfFactory = parseFunctionArgs(factory)
          .map(dependencyName => this.getDependency(dependencyName));
        return dependenciesOfFactory;
      } catch (error) {
        if (error instanceof DependencyNotFoundError) {
          throw new Error('Dependency cannot be registered as one or more of its dependencies have not been registered');
        }
        throw error;
      }
    },

    getDependency(name) {
      if (this.dependencies[name]) {
        return this.dependencies[name];
      }
      throw new DependencyNotFoundError('The requested dependency could not be found');
    },
  },
});

