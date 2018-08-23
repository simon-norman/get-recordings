
const { expect } = require('chai');
const sinon = require('sinon');

const RecordingControllerStampFactory = require('./recording_controller.js');
const EventEmittableStamp = require('../helpers/event_emittable_stamp');


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

  beforeEach(() => {
    setMockRecordingToBeSaved();

    setUpMockRecordingModelWithSpies();
  });

  describe('Save recording', () => {
    beforeEach(() => {
      RecordingControllerStamp =
        RecordingControllerStampFactory(EventEmittableStamp, MockRecordingModel);

      recordingController = RecordingControllerStamp();
    });

    it('should save recording', async function () {
      recordingController.saveSingleRecording(mockRecordingToBeSaved);

      expect(saveRecordingSpy.calledOnce).to.equal(true);
      expect(mockModelConstructorSpy.args[0][0]).to.deep.equal(mockRecordingToBeSaved);
    });
  });

  describe('Handle errors', () => {
    let MockRecordingModelThrowsError;

    beforeEach(() => {
      MockRecordingModelThrowsError = class extends MockRecordingModel {
        save() {
          saveRecordingSpy();
          return new Promise((resolve, reject) => {
            reject(new Error('Save error'));
          });
        }
      };

      RecordingControllerStamp =
        RecordingControllerStampFactory(EventEmittableStamp, MockRecordingModelThrowsError);

      recordingController = RecordingControllerStamp();
    });

    it('should pass error event if error encountered when saving recordings', function (done) {
      const errors = [];

      recordingController.on('saverecordingerror', (error) => {
        errors.push(error);
      });
      recordingController.saveSingleRecording(mockRecordingToBeSaved);

      setTimeout(() => {
        expect(errors.length).to.equal(1);
        done();
      }, 100);
    });

    it('should throw error if event emittable stamp not provided to stamp factory', function () {
      const wrappedStampFactoryFunction = () => {
        RecordingControllerStampFactory();
      };

      expect(wrappedStampFactoryFunction).throw();
    });
  });
});

