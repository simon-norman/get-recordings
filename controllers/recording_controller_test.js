
const { expect } = require('chai');
const sinon = require('sinon');

const RecordingControllerStamp = require('./recording_controller.js');


describe('recording_controller', () => {
  describe('Save new recordings', () => {
    it('should save recordings', async () => {
      const mockRecordingsToBeSaved = [{
        recordedObjectId: 1,
        timestampRecorded: 'date1',
        longitude: 10,
        latitude: 10,
        spaceIds: ['1', '2'],
      },
      {
        recordedObjectId: 2,
        timestampRecorded: 'date2',
        longitude: 20,
        latitude: 20,
        spaceIds: ['3', '4'],
      }];

      const mockModelConstructorSpy = sinon.spy();
      const saveRecordingSpy = sinon.spy();
      const mockSavedRecordingsReturnedByModel = 'recordings';

      class mockRecordingsModel {
        constructor({
          recordedObjectId,
          timestampRecorded,
          longitude,
          latitude,
          spaceIds,
        }) {
          this.modelData = {
            recordedObjectId,
            timestampRecorded,
            longitude,
            latitude,
            spaceIds,
          };
          mockModelConstructorSpy(this.modelData);
        }

        save() {
          saveRecordingSpy();
          return new Promise((resolve) => {
            resolve(mockSavedRecordingsReturnedByModel);
          });
        }
      }

      const recordingController = RecordingControllerStamp(mockRecordingsModel);
      recordingController.saveRecordings(mockRecordingsToBeSaved);

      expect(saveRecordingSpy.calledTwice);
      expect(mockModelConstructorSpy.args[0][0]).to.deep.equal(mockRecordingsToBeSaved[0]);
      expect(mockModelConstructorSpy.args[1][0]).to.deep.equal(mockRecordingsToBeSaved[1]);
    });
  });
});

