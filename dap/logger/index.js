'use strict';

const
  winston = require('winston'),
  logger = new(winston.Logger)({
    transports: [
      new(winston.transports.File)({
        level: 'debug',
        filename: './dapChatDebug.log',
        handleExceptions: true
      }),
      new(winston.transports.Console)({
        level: 'debug',
        json: true,
        handleExceptions: true
      })
    ],
    exitOnError: false
  });

module.exports = logger;