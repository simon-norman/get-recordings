const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecordingSchema = new Schema({
  objectId: { type: String, required: true },
  timestampRecorded: { type: String, required: true },
  longitude: { type: Number, required: false },
  latitude: { type: Number, required: false },
  spaceIds: [
    { type: String, required: false },
  ],
});

const Recording = mongoose.model('recording', RecordingSchema);

module.exports = Recording;