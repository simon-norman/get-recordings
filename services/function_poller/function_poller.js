
module.exports = () => {
  const functionPoller = {
    pollFunction({
      functionToPoll,
      pollingIntervalInMilSecs,
      callbackForFunctionResult,
    }) {
      this.intervalId = setInterval(() => {
        const resultFromFunction = functionToPoll();
        callbackForFunctionResult(resultFromFunction);
      }, pollingIntervalInMilSecs);
    },

    stopPollFunction() {
      clearInterval(this.intervalId);
    },
  };

  return functionPoller;
};

