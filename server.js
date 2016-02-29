'use strict';

const express = require('express'),
  dap = express(),
  dapChat = require('./dap'),
  passport = require('passport');

// Express Middleware
dap.set('port', process.env.PORT || 3000);
const PORT = dap.get('port');
dap.use(express.static('public'));
dap.use(express.static('node_modules/babel-standalone'));
dap.set('view engine', 'ejs');

// Modules being exported by the DAPChat
dap.use(dapChat.session);
dap.use(passport.initialize());
dap.use(passport.session());
dap.use(require('morgan')('combined', {
  stream: {
    write: (message) => {
      // Write to logs console
      dapChat.logger.log('info', message);
    }
  }
}))

dap.use('/', dapChat.router);

dapChat.ioServer(dap).listen(PORT, () => {
  console.log('DAPChat Running on Port: ', PORT);
});