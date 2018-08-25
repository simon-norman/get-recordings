
const { expect } = require('chai');
const sinon = require('sinon');

const RecordingControllerStampFactory = require('./recording_controller.js');


describe('recording_controller', () => {
  let mockRecordingToBeSaved;
  let mockModelConstructorSpy;
  let saveRecordingSpy;
  let MockRecordingModel;
  let RecordingControllerStamp;
  let recordingController;

  const setMockRecordingToBeSaved = () => {
    mockRecordingToBeSaved = {
      objectId: 1,
      timestampRecorded: 'date1',
      longitude: 10,
      latitude: 10,
      spaceIds: ['1', '2'],
    };
  };

  const setUpMockRecordingModelWithSpies = () => {
    mockModelConstructorSpy = sinon.spy();
    saveRecordingSpy = sinon.spy();

    MockRecordingModel = class {
      constructor({
        objectId,
        timestampRecorded,
        longitude,
        latitude,
        spaceIds,
      }) {
        this.modelData = {
          objectId,
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
          resolve();
        });
      }
    };
  };

  describe('Save recording', () => {
    beforeEach(() => {
      setMockRecordingToBeSaved();

      setUpMockRecordingModelWithSpies();

      RecordingControllerStamp =
        RecordingControllerStampFactory(MockRecordingModel);

      recordingController = RecordingControllerStamp();
    });

    it('should save recording, returning promise for the save call', async function () {
      await recordingController.saveSingleRecording(mockRecordingToBeSaved);

      expect(saveRecordingSpy.calledOnce).to.equal(true);
      expect(mockModelConstructorSpy.args[0][0]).to.deep.equal(mockRecordingToBeSaved);
    });
  });
});

