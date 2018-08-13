
const { expect } = require('chai');

const { registerDependency, getDependency, registerFactory } = require('./di_container.js');
const { diMockDependency1 } = require('./di_mock_dependency_1.js');


describe('di_container', () => {
  it('should register a new module dependency and return it when requested', async () => {
    registerDependency('diMockDependency1', './di_mock_dependency_1.js');
    registerFactory('diMockDependency2', './di_mock_dependency_2.js');
    registerFactory('diMockModule', './di_mock_module.js');
    const diMockModule = getDependency('diMockModule');
    expect(diMockModule.diMockDependency1).to.equal(diMockDependency1);
    expect(diMockModule.diMockDependency2.id).to.equal(1);
  });
});

