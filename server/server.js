const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const lodash = require('lodash');

const {roomData}=require('../public/roomData.js');
var obj=new roomData();

const port=process.env.PORT || 3000;

const app=express();

var server=http.createServer(app);

//GIVES US THE WEB SOCKET SERVER, TO COMMUNICATE BETWEEN THE SERVER AND THE CLIENT
//OUR SERVER IS READY TO ACCEPT NEW CONNECTIONS
var io=socketIo(server);

io.on('connection',(socket) => {
  console.log('New User Connected');

  //socket.emit('firstMsg',message('Admin','Welcome..!!'));

  //socket.broadcast.emit('firstMsg',message('Admin','A new user has joined'));

  socket.on('msgCreated',function (messageCreated) {

    socket.broadcast.to(messageCreated.room).emit('newMsg',message(`${messageCreated.from}`,`${messageCreated.message}`));

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

    obj.addUser(obj.users.length+1,params.user,params.room);

    socket.join(params.room);

    socket.emit('iojoin',message('Admin',`Welcome to '${params.room}' room`));
    socket.broadcast.to(params.room).emit('bdcstjoin',message('Admin',`${params.user} has joined us.`),params.user);
      callback('',obj.getUserList(params.room),params.room);
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
