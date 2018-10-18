

const stubApis = ({ diContainer, unconvertedRecordings }) => {
  const accessTokensGetter = diContainer.getDependency('accessTokensGetter');
  const accuwareApi = diContainer.getDependency('accuwareApi');
  const recordingApi = diContainer.getDependency('recordingApi');

  const accuwareApiStubConfig = Object.assign(siteConfig, { accuwareApi, unconvertedRecordings });

  getAccuwareRecordingsStub = stubGetAccuwareRecordings(accuwareApiStubConfig);
  stubSaveRecordings({ recordingApi });
  stubGetAccessToken({ accessTokensGetter });
};

module.exports = stubApis;
