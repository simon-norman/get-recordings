
const { expect } = require('chai');
const sinon = require('sinon');
const csvFilesToJsonConverterStamp = require('./csv_files_to_json_converter');


describe('device_category_lookup_file_loader', () => {
  let convertCsvFilesToJsonConfig;
  let csvToJsonConverter;

  beforeEach(() => {
    const stubbedFromFile = sinon.stub();
    stubbedFromFile.returns(Promise.resolve({ someJson: 'somejsondata' }));

    const stubbedCsvToJson = () => ({ fromFile: stubbedFromFile });
    convertCsvFilesToJsonConfig = {
      filepaths: ['filepath1', 'filepath2'],
      csvToJson: stubbedCsvToJson,
    };

    csvToJsonConverter = csvFilesToJsonConverterStamp();
  });

  it('should convert CSV files at specified filepaths to JSON, then return JSON', async function () {
    const mockCsvConvertedToJson
      = await csvToJsonConverter.convertCsvFilesToJson(convertCsvFilesToJsonConfig);

    expect(mockCsvConvertedToJson).to.deep.equal([{ someJson: 'somejsondata' }, { someJson: 'somejsondata' }]);
  });
});

