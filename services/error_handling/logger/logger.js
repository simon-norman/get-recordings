
const Raven = require('raven');

Raven.config('https://068084ef143940ab92b8d162f253702a@sentry.io/1268748', {
  captureUnhandledRejections: true,
}).install();

const logException = (exception) => {
  Raven.captureException(exception);
};

const wrapperToHandleUnhandledExceptions = Raven.context.bind(Raven);

module.exports = { logException, wrapperToHandleUnhandledExceptions };

