
const { expect } = require('chai');

const { registerForLocationData } = require('./accuware_api.js');


describe('accuware_api', () => {
  it('should call accuware api with specified parameters', async () => {
    // register to receive data with very small interval
    // check that api called with specified parameters
    registerDependency('diMockDependency1', './di_mock_dependency_1.js');
    registerFactory('diMockDependency2', './di_mock_dependency_2.js');
    registerFactory('diMockModule', './di_mock_module.js');
    const diMockModule = getDependency('diMockModule');
    expect(diMockModule.diMockDependency1).to.equal(diMockDependency1);
    expect(diMockModule.diMockDependency2.id).to.equal(1);
  });
});

