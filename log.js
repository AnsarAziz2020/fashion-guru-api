const log4js = require('log4js');

// Configure log4js
log4js.configure({
  appenders: { 
    file: { type: 'file', filename: 'logs/app.log' } // Log to a file
  },
  categories: { 
    default: { appenders: ['file'], level: 'debug' } // Log all messages with level 'debug' or higher
  }
});

// Get a logger instance
const logger = log4js.getLogger();
// logger.trace('This is a TRACE message');
// logger.debug('This is a DEBUG message');
// logger.info('This is an INFO message');
// logger.warn('This is a WARN message');
// logger.error('This is an ERROR message');
// logger.fatal('This is a FATAL message');

module.exports = logger