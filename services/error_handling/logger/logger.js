
const Raven = require('raven');

module.exports = (environment) => {
  let logException;
  let wrapperToHandleUnhandledExceptions;

  const setUpRaven = () => {
    Raven.config(
      'https://c8afdeeb3dcd4ce1ac8575637d5114f0@sentry.io/1284856',
      {
        captureUnhandledRejections: true,
      },
    ).install();
  };

  const setUpHandlingExceptionsRejectionsProdEnv = () => {
    setUpRaven();

    logException = (exception) => {
      Raven.captureException(exception);
    };

    wrapperToHandleUnhandledExceptions = Raven.context.bind(Raven);
  };

  const wrapperToHandleUnhandledExceptionsDev = (functionToWrap) => {
    process.on('uncaughtException', (error) => {
      console.error(error.stack);
      process.exit();
    });

    process.on('unhandledRejection', (error) => {
      console.log('unhandledRejection', error.stack);
      process.exit();
    });

    functionToWrap();
  };

  const setUpHandlingExceptionsRejectionsDevEnv = () => {
    logException = (exception) => {
      console.log(exception.stack);
    };

    wrapperToHandleUnhandledExceptions = wrapperToHandleUnhandledExceptionsDev;
  };


  if (environment === 'production') {
    setUpHandlingExceptionsRejectionsProdEnv();
  } else {
    setUpHandlingExceptionsRejectionsDevEnv();
  }

  return { logException, wrapperToHandleUnhandledExceptions };
};

