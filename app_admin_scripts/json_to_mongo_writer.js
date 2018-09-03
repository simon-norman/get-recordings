
const stampit = require('stampit');
const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = stampit({
  methods: {
    async writeJsonToMongo(jsonToMongoConfig) {
      const emptySchema = new Schema({}, { strict: false });

      const ModelWithEmptySchema
        = jsonToMongoConfig.mongooseConnection.model(jsonToMongoConfig.schemaName, emptySchema);

      return ModelWithEmptySchema.insertMany(jsonToMongoConfig.json);
    },
  },
});
