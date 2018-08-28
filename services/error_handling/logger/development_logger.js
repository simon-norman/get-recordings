
const logException = (exception) => {
  console.log(exception);
};

const wrapperToHandleUnhandledExceptions = async (functionToWrap) => {
  try {
    await functionToWrap();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { logException, wrapperToHandleUnhandledExceptions };

