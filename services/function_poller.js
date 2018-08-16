
const stampit = require('stampit');
const { EventEmitter } = require('events');

module.exports = stampit({
  init() {
    const eventEmitter = new EventEmitter();
    this.emit = eventEmitter.emit;
  },

  methods: {
    pollFunction(config) {
      setInterval(() => {
        const result = config.functionToPoll();
        this.emit(config.functionResultEventName, result);
      }, config.pollingIntervalInMilSecs);
    },
  },
});

