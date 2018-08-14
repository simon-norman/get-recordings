
const { expect } = require('chai');

const { registerDependency, getDependency, registerDependencyFromFactory } = require('./di_container.js');
const { diMockDependency1 } = require('./di_mock_dependency_1.js');
const diMockDependency2 = require('./di_mock_dependency_2.js');
const diMockDependency3 = require('./di_mock_dependency_3.js');


describe('di_container', () => {
  describe('successfully register and return dependencies', () => {
    it('should register a dependency and return it when requested', async () => {
      registerDependency('diMockDependency1', diMockDependency1);
      const registeredDiMockDependency1 = getDependency('diMockDependency1');
      expect(registeredDiMockDependency1).to.equal(diMockDependency1);
    });

    it('should generate dependency from factory, injecting it with its required dependencies, then register it', async () => {
      registerDependency('diMockDependency1', diMockDependency1);
      registerDependencyFromFactory('diMockDependency2', diMockDependency2);
      registerDependencyFromFactory('diMockDependency3', diMockDependency3);

      const registeredDiMockDependency3 = getDependency('diMockDependency3');

      expect(registeredDiMockDependency3.compose.properties.diMockDependency1)
        .to.equal(diMockDependency1);
      expect(registeredDiMockDependency3.compose.properties.propertyOfDiMockDependency2)
        .to.equal('propertyOfDiMockDependency2');
    });
  });

  describe('throw errors when registering / getting dependencies fails', () => {
    it('should throw an error when dependency has already been registered', async () => {
      const wrappedRegisterDependency = () => {
        registerDependency('diMockDependency1', diMockDependency1);
      };
      wrappedRegisterDependency();
      expect(wrappedRegisterDependency).to.throw(Error);
    });
  });
});

