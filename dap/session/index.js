'use strict';
const session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  config = require('../config'),
  db = require('../db');


if (process.env.NODE_ENV === 'production') {

  // Initialize session with setting for Prod
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db.Mongoose.connection
    })
  });
} else {
  // Initialize session with setting for Dev
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  });
}