
const stampit = require('stampit');

module.exports = (EventEmittableStamp) => {
  const FunctionPollerWithoutEmitterStamp = stampit({
    init(config) {
      this.checkPollConfigValid(config);
      this.functionResultEventName = config.functionResultEventName;
      this.functionToPoll = config.functionToPoll;
      this.pollingIntervalInMilSecs = config.pollingIntervalInMilSecs;
    },

    methods: {
      pollFunction() {
        this.intervalId = setInterval(() => {
          try {
            const result = this.functionToPoll();
            this.emit(this.functionResultEventName, result);
          } catch (error) {
            this.emit('error', error);
          }
        }, this.pollingIntervalInMilSecs);
      },

      checkPollConfigValid(config) {
        if (!config.pollingIntervalInMilSecs > 0) {
          throw new TypeError('Polling interval must be a number greater than 0');
        } else if (!config.functionResultEventName) {
          throw new TypeError('No function result event name provided to emit events with that name');
        } else if (!config.functionToPoll) {
          throw new TypeError('No function provided to function poller');
        } else {
          return true;
        }
      },
    },
  });
  return EventEmittableStamp.compose(FunctionPollerWithoutEmitterStamp);
};

