
const { expect } = require('chai');

const DeviceInfoControllerStampFactory = require('./device_info_controller');


describe('device_category_controller', function () {
  it('should make call to get device information for the specified oui and return result of call', async function () {
    const mockDeviceInfoDocument = 'some device info';
    const mockDeviceInfo = {
      findOne: () => Promise.resolve(mockDeviceInfoDocument),
    };

    const DeviceInfoControllerStamp = DeviceInfoControllerStampFactory(mockDeviceInfo);
    const deviceInfoController = DeviceInfoControllerStamp();

    const deviceInfo = await deviceInfoController.getDeviceInfo('mockOui');
    expect(deviceInfo).to.equal(mockDeviceInfoDocument);
  });
});

