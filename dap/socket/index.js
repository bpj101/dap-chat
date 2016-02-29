'use strict';

const h = require('../helpers');

module.exports = (io, dap) => {
  let allrooms = dap.locals.chatrooms;

  io.of('/roomslist').on('connection', (socket) => {
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });

    socket.on('createNewRoom', (newRoomInput) => {
      // Check to see if a room with the same title exist
      // If not, create a new room and broadcast to everyone connected
      if (!h.findRoomByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput,
          roomID: h.randomHex(),
          users: []
        });

        // Emit an updated list to the creator
        socket.emit('chatRoomsList', JSON.stringify(allrooms));

        // Emit an updated list to all users connected
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });
  });

  io.of('/chatter').on('connection', (socket) => {
    // Join a chatroom
    socket.on('join', (data) => {
      let userList = h.addUserToRoom(allrooms, data, socket);
      console.log('userList: ', userList);

      // Update the list of active users as shown on the chatroom page
      socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(userList.users));
      socket.emit('updateUsersList', JSON.stringify(userList.users));
    });

    // When a socket exits
    socket.on('disconnect', () => {
      // Find the room, from where the socket is connected to and purge the user
      let room = h.removeUserFromRoom(allrooms, socket);
      socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
    });

    // When a new message arrives
    socket.on('newMessage', (data) => {
      socket.broadcast.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });
  });
};