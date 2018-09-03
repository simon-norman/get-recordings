
const stampit = require('stampit');

module.exports = stampit({
  methods: {
    async convertCsvFilesToJson(convertCsvFilesToJsonConfig) {
      const { filepaths } = convertCsvFilesToJsonConfig;
      const { csvToJson } = convertCsvFilesToJsonConfig;

      const promisesToConvertCsvFiles = [];

      for (const filepath of filepaths) {
        promisesToConvertCsvFiles.push(csvToJson().fromFile(filepath));
      }

      const convertedCategoryLookupPerEnv
        = await Promise.all(promisesToConvertCsvFiles);

      return convertedCategoryLookupPerEnv;
    },
  },
});
