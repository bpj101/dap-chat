'use strict';

const config = require('../config'),
  logger = require('../logger'),
  Mongoose = require('mongoose').connect(config.dbURI);


// Log an error if the connections fails
Mongoose.connection.on('error', (error) => {
  logger.log('error', 'MongoDB Connection Error: ' + error);
});

// Create a Schema that defines the structure for the storing user data
const chatUser = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

// Turn the schema into a usable model
let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
  Mongoose: Mongoose,
  userModel: userModel
};