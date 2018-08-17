
const stampit = require('stampit');

module.exports = (EventEmittableStamp) => {
  const FunctionPollerWithoutEmitterStamp = stampit({
    methods: {
      pollFunction(config) {
        if (this.isPollConfigValid(config)) {
          setInterval(() => {
            try {
              const result = config.functionToPoll();
              this.emit(config.functionResultEventName, result);
            } catch (error) {
              this.emit('error', error);
            }
          }, config.pollingIntervalInMilSecs);
        }
      },

      isPollConfigValid(config) {
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

