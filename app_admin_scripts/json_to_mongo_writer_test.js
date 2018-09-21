
const { expect } = require('chai');
const JsonToMongoWriterStamp = require('./json_to_mongo_writer');
const mongoose = require('mongoose');


describe('json_to_mongo_writer', () => {
  let mongooseConnection;
  let jsonToMongoWriter;

  before(async () => {
    mongooseConnection = await mongoose.createConnection('mongodb://localhost:27017/tracking_app_dev', { useNewUrlParser: true });

    jsonToMongoWriter = JsonToMongoWriterStamp();
  });

  after(async () => {
    await mongooseConnection.close();
  });

  it('should save json data to mongo', async function () {
    const jsonToMongoConfig = {
      json: { someJsonData: 'somejsondata' },
      schemaName: 'deviceCategoryLookup',
      mongooseConnection,
    };

    const savedJsonData = await jsonToMongoWriter.writeJsonToMongo(jsonToMongoConfig);

    expect(savedJsonData[0].someJsonData).to.equal(jsonToMongoConfig.json.someJsonData);
  });
});

