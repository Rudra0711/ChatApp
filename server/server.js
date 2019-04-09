const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const lodash = require('lodash');

const port=process.env.PORT || 3000;

const app=express();

var server=http.createServer(app);

//GIVES US THE WEB SOCKET SERVER, TO COMMUNICATE BETWEEN THE SERVER AND THE CLIENT
//OUR SERVER IS READY TO ACCEPT NEW CONNECTIONS
var io=socketIo(server);

io.on('connection',(socket) => {
  console.log('New User Connected');

  socket.emit('firstMsg',message('Server','Welcome..!!'));

  socket.broadcast.emit('firstMsg',message('Server','A new user has joined'));

  socket.on('msgCreated',function (messageCreated) {

    console.log('Message created : ',messageCreated);

    socket.broadcast.emit('newMsg',message(`${messageCreated.from}`,`${messageCreated.message}`));

  });

  socket.on('location',function (position) {

    socket.broadcast.emit('locationMsg',{
      from:'User',
      latitude:position.latitude,
      longitude:position.longitude});
  });

  socket.on('join',(params,callback) => {
    if (!isString(params.user) || !isString(params.room)) {
        callback('Username or Room name is empty!\nJoining in failed');
    }
    callback();
  });

  socket.on('disconnect',() => {
    console.log('User Disconnected');
  });
});

var message=function (name,msg) {
return  {
    from:name,
    message:msg,
    createdAt:new Date()
  };
};

var isString=(str) => {
  return typeof str === 'string' && str.trim().length>0;
};

app.use(express.static(__dirname+'/../public'));

server.listen(port,() => {
  console.log(`Server up at port ${port}`);
});

//  BY DEFAULT THE EXPRESS MODULE USES THE HTTP BUILT IN MODULE TO LOAD Server
// BUT TO CONNECT TO SOCKETIO, WE HAVE TO EXPLICITLY USE HTTP MODULE
