
const { expect } = require('chai');
const mongoose = require('mongoose');
const { getConfigForEnvironment } = require('../config/config.js');
const Recording = require('./recording.js');

describe('recording_controller', () => {
  let config;
  let mockRecording;

  const ensureRecordingCollectionEmpty = async () => {
    const recordings = await Recording.find({});
    if (recordings.length) {
      Recording.collection.drop();
    }
  };

  before((done) => {
    config = getConfigForEnvironment(process.env.NODE_ENV);
    mongoose.connect(config.trackingDatabase.uri, { useNewUrlParser: true })
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  beforeEach(async () => {
    mockRecording = {
      recordedObjectId: '2',
      timestampRecorded: 'date2',
      longitude: 20,
      latitude: 20,
      spaceIds: ['3', '4'],
    };

    await ensureRecordingCollectionEmpty();
  });

  after(async () => {
    await ensureRecordingCollectionEmpty();
    mongoose.connection.close();
  });

  it('should save recording when validation is successful', async function () {
    const recording = new Recording(mockRecording);
    const savedRecording = await recording.save();
    expect(savedRecording.recordedObjectId).to.equal(mockRecording.recordedObjectId);
    expect(savedRecording.timestampRecorded).to.equal(mockRecording.timestampRecorded);
    expect(savedRecording.longitude).to.equal(mockRecording.longitude);
    expect(savedRecording.latitude).to.equal(mockRecording.latitude);
    expect(savedRecording.spaceIds[0]).to.equal(mockRecording.spaceIds[0]);
    expect(savedRecording.spaceIds[1]).to.equal(mockRecording.spaceIds[1]);
  });

  it('should reject save if timestamp not provided', async function () {
    mockRecording.timestampRecorded = '';

    const recording = new Recording(mockRecording);

    let errorFound = false;
    try {
      await recording.save();
    } catch (error) {
      errorFound = true;
    }

    expect(errorFound).to.equal(true);
  });

  it('should reject save if recordedObjectId not provided', function () {
  });
});

