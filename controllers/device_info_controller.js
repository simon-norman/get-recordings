const stampit = require('stampit');

module.exports = DeviceInfo => stampit({
  props: {
    DeviceInfo,
  },

  methods: {
    getDeviceInfo(oui) {
      return DeviceInfo.findOne({ oui });
    },
  },
});

