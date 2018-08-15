
const { expect } = require('chai');

const config = require('./config.js');


describe('di_container', () => {
  describe('get config for the specified environment', () => {
    it('should return config for the specified environment', async () => {
      const configForProduction = config.getConfigForEnvironment('production');
      expect(configForProduction).to.exist;
    });

    it('should throw an error when environment specified is not found in config', async () => {
      const wrappedGetConfigForEnvironment = () => {
        config.getConfigForEnvironment('fakeenvironment');
      };
      expect(wrappedGetConfigForEnvironment).to.throw(Error);
    });
  });
});

