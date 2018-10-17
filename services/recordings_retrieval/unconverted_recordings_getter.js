

const UnconvertedRecordingsGetterFactory = (
  accuwareApi,
  FunctionPollerFactory,
  recordingsWriterForUsageAnalysis,
  logException
) => {
  const mapOfSitesToGetRecordingsPollers = new Map();

  const stopGettingRecordings = (siteId) => {
    const functionPollerToBeStopped = mapOfSitesToGetRecordingsPollers.get(siteId);

    functionPollerToBeStopped.stopPollFunction(siteId);
  };

  const saveRecordingsInUsageAnalysisFormat = (
    unconvertedRecordings,
    timestampCallMade,
    siteId
  ) => {
    try {
      recordingsWriterForUsageAnalysis.saveRecordingsInUsageAnalysisFormat(
        unconvertedRecordings,
        timestampCallMade,
      );
    } catch (error) {
      logException(error);
      stopGettingRecordings(siteId);
    }
  };

  const handleGetRecordingsResult = (result, siteId) => {
    result
      .then(({ recordings, timestampCallMade }) => {
        saveRecordingsInUsageAnalysisFormat(recordings, timestampCallMade, siteId);
      })
      .catch((error) => {
        logException(error);
        stopGettingRecordings(siteId);
      });
  };

  const unconvertedRecordingsGetter = {

    startGettingRecordings(siteConfig) {
      const functionPoller = FunctionPollerFactory();
      mapOfSitesToGetRecordingsPollers.set(siteConfig.siteId, functionPoller);

      const functionToPoll = () => {
        accuwareApi.getDeviceRecordings(siteConfig);
      };

      const callbackForFunctionResult = (result) => {
        handleGetRecordingsResult(result, siteConfig.siteId);
      };

      const pollFunctionConfig = {
        functionToPoll,
        pollingIntervalInMilSecs: siteConfig.intervalPeriodInSeconds * 1000,
        callbackForFunctionResult,
      };

      functionPoller.pollFunction(pollFunctionConfig);
    },
  };

  return unconvertedRecordingsGetter;
};

module.exports = UnconvertedRecordingsGetterFactory;

