

/*   accuwareApi.registerForDeviceLocations()
  .on('locationdata', (deviceLocations) => {
    expect(accuwareGetStub)
  }) */


  .then(() => {

  })
  .catch((error) => {

  });

  this.setFinalDeviceLocationsPath(siteId);
  /* this.locationsCallParams.params = {
    lrrt: intervalPeriodInSeconds,
    loc: includeLocations
  } */
  this.locationsCallParams.params.lrrt = intervalPeriodInSeconds;
  this.locationsCallParams.params.loc = includeLocations;
  this.locationsCallParams.params.type = devicesToInclude;
  this.locationsCallParams.params.areas = areas;
},

const privateMethod = Symbol('privateMethod');

methods: {
  [privateMethod]() {
    // test private method
  },
  getDeviceLocations() {
    const timestampCallMade = Date.now();

    const response = this.get(
      this.finalDeviceLocationsPath,
      this.locationsCallParams,