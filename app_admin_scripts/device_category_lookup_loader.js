const csvFilesToJsonConverterStamp = require('./csv_files_to_json_converter');
const JsonToMongoWriterStamp = require('./json_to_mongo_writer');
const csvToJson = require('csvtojson');
const path = require('path');
const mongoose = require('mongoose');

let deviceCategoryLookupAsJson;
let jsonToMongoConfig;
let jsonToMongoWriter;

const convertDeviceCategoryLookupCsvToJson = async () => {
  const convertCsvFilesToJson = csvFilesToJsonConverterStamp();

  const deviceCategoryLookupFilepath = path.join(__dirname, './oui.csv');

  const convertCsvFilesToJsonConfig = {
    filepaths: [deviceCategoryLookupFilepath],
    csvToJson,
  };

  const convertedDeviceCategoryLookupsForEachFilepath
    = await convertCsvFilesToJson.convertCsvFilesToJson(convertCsvFilesToJsonConfig);
  [deviceCategoryLookupAsJson] = convertedDeviceCategoryLookupsForEachFilepath;
};

const setUpJsonToMongo = () => {
  jsonToMongoWriter = JsonToMongoWriterStamp();

  jsonToMongoConfig = {
    json: deviceCategoryLookupAsJson,
    schemaName: 'deviceCategoryLookup',
  };
};

const getTrackingDatabaseConnection = (environment) => {
  const trackingDatabaseName = `${environment}_TRACKING_DATABASE_URI`;
  const trackingDatabaseUri = process.env[trackingDatabaseName];

  return mongoose.createConnection(trackingDatabaseUri, { useNewUrlParser: true });
};

const loadDeviceCategoryLookupIntoDb = (environment) => {
  const trackingDatabaseConnectionPromise = getTrackingDatabaseConnection(environment);

  const promiseToLoadLookupIntoDb
    = Promise.resolve(trackingDatabaseConnectionPromise.then((trackingDatabaseConnection) => {
      jsonToMongoConfig.mongooseConnection = trackingDatabaseConnection;

      return jsonToMongoWriter.writeJsonToMongo(jsonToMongoConfig);
    }));

  return promiseToLoadLookupIntoDb;
};

const resolvePromisesToLoadLookupsIntoAllDbs = async (promisesToLoadLookupsIntoAllDbs) => {
  try {
    await Promise.all(promisesToLoadLookupsIntoAllDbs);

    const closingTrackingDbConnections = [];
    mongoose.connections
      .forEach(connection => closingTrackingDbConnections.push(connection.close()));

    await Promise.all(closingTrackingDbConnections);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const loadDeviceCategoryLookupsIntoAllDbs = async () => {
  await convertDeviceCategoryLookupCsvToJson();

  setUpJsonToMongo();

  const environments = ['development', 'test'];
  const promisesToLoadLookupsIntoAllDbs = [];

  for (const environment of environments) {
    const promiseToLoadLookupIntoDb = loadDeviceCategoryLookupIntoDb(environment);

    promisesToLoadLookupsIntoAllDbs.push(promiseToLoadLookupIntoDb);
  }
  resolvePromisesToLoadLookupsIntoAllDbs(promisesToLoadLookupsIntoAllDbs);
};

loadDeviceCategoryLookupsIntoAllDbs();

