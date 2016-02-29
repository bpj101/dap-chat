'use strict';

const config = require('./config'),
  redis = require('redis').createClient,
  adapter = require('socket.io-redis');

// Social Authentication Logic
require('./auth')();

// Create an IO Server instance
let ioServer = (dap) => {
  dap.locals.chatrooms = [];
  const server = require('http').Server(dap);
  const io = require('socket.io')(server);

  io.set('transports', ['websocket']);

  let pubClient = redis(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
  });
  let subClient = redis(config.redis.port, config.redis.host, {
    return_buffers: true,
    auth_pass: config.redis.password
  });

  io.adapter(adapter({
    pubClient,
    subClient
  }));

  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  })
  require('./socket')(io, dap);
  return server;
}

module.exports = {
  router: require('./routes')(),
  session: require('./session'),
  ioServer: ioServer,
  logger: require('./logger')
};