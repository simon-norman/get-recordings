
const { expect } = require('chai');
const sinon = require('sinon');

const RecordingControllerStampFactory = require('./recording_controller.js');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');


describe('recording_controller', () => {
  let mockRecordingsToBeSaved;
  let mockModelConstructorSpy;
  let saveRecordingSpy;
  let MockRecordingsModel;
  let RecordingControllerStamp;
  let recordingController;

  const setMockRecordingsToBeSaved = () => {
    mockRecordingsToBeSaved = [{
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
  };

  const setUpMockRecordingsModelWithSpies = () => {
    mockModelConstructorSpy = sinon.spy();
    saveRecordingSpy = sinon.spy();

    MockRecordingsModel = class {
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
          resolve();
        });
      }
    };
  };

  beforeEach(() => {
    setMockRecordingsToBeSaved();

    setUpMockRecordingsModelWithSpies();

    RecordingControllerStamp = RecordingControllerStampFactory(EventEmittableStamp);
  });

  describe('Save new recordings', () => {
    beforeEach(() => {
      recordingController = RecordingControllerStamp(MockRecordingsModel);
    });

    it('should save recordings', async function () {
      recordingController.saveRecordings(mockRecordingsToBeSaved);

      expect(saveRecordingSpy.calledTwice);
      expect(mockModelConstructorSpy.args[0][0]).to.deep.equal(mockRecordingsToBeSaved[0]);
      expect(mockModelConstructorSpy.args[1][0]).to.deep.equal(mockRecordingsToBeSaved[1]);
    });
  });

  describe('Handle errors', () => {
    let MockRecordingsModelThrowsError;

    beforeEach(() => {
      MockRecordingsModelThrowsError = class extends MockRecordingsModel {
        save() {
          saveRecordingSpy();
          return new Promise((resolve, reject) => {
            reject(new Error('Save error'));
          });
        }
      };

      recordingController = RecordingControllerStamp(MockRecordingsModelThrowsError);
    });

    it('should pass error event if error encountered when saving recordings', function (done) {
      const errors = [];

      recordingController.on('saverecordingerror', (error) => {
        errors.push(error);
      });
      recordingController.saveRecordings(mockRecordingsToBeSaved);

      setTimeout(() => {
        expect(errors.length).to.equal(2);
        done();
      }, 100);
    });
  });
});

