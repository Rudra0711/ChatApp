
//MAKING A CALL FROM CLIENT TO SERVER TO GET AND MAINTAIN THE CONNECTION
  var socket=io();

    socket.on('connect', function()  {
    console.log('Connected to server');

    var params=jQuery.deparam(window.location.search);

    socket.emit('join',params,(err,users,room) => {
      if (err && err.length>0) {
        alert(err);
        window.location.href="/";
      }else {
        for (var user in users) {
          var li=jQuery('<li class="onlineUsers"></li>');
          li.text(users[user]);
          jQuery('.listusers').append(li);
        }
        var roomH=jQuery('<h1 id="roomH"></h1>');
        roomH.text(room);
        jQuery('#titlePane').append(roomH);
      }
    });

    socket.on('iojoin',(msg) => {
      displayMsg(msg.from,msg.message);
    });

    socket.on('bdcstjoin',(msg,user) => {
      displayMsg(msg.from,msg.message);
      var li=jQuery('<li class="onlineUsers"></li>');
      li.text(user);

      jQuery('.listusers').append(li);
    });

    var displayMsg=function (from,message) {
      var div=jQuery('<div class="messages"></div>');
      var pf=jQuery('<p id="from"></p>');
      pf.text(`${from}`);
      var pm=jQuery('<p id="message"></p>');
      pm.text(`${message}`);

      pf.append(pm);
      div.append(pf);

      var li=jQuery('<li></li>');
      li.append(div);
      jQuery('#messages').append(div);
    };

    socket.on('newMsg',function (newMessage) {

      console.log('Message from a user ',newMessage);

      displayMsg(newMessage.from,newMessage.message);

    });

    socket.on('locationMsg',function (location) {

      var latitude=location.latitude;
      var longitude=location.longitude;

      var div=jQuery('<div class="messages"></div>');

      var pF=jQuery('<p id="from"></p>');
      pF.text(`${location.from}`);

      var pM=jQuery(`<p id="message"><a id="location" href="https://www.google.com/maps?q=${latitude},${longitude}">My Current Location</a></p>`);

      pF.append(pM);
      div.append(pF);

      var li=jQuery('<li></li>');
      li.append(div);
      jQuery('#messages').append(li);

    });

  });

   socket.on('disconnect', function()  {
    console.log('Disconnected from server');
  });

   var cnt=0;

   jQuery('#msg-form').on('submit',function (e) {
    e.preventDefault();

    var params=jQuery.deparam(window.location.search);

    socket.emit('msgCreated',{
      from:params.user,
      message: jQuery('[name=message]').val(),
      room:params.room
    });

    $('#textbox').val('');

    var hPane =  parseInt(jQuery('.leftPane').css("height").replace('px',''),10);
    var hMsg =   parseInt(jQuery('.messages').css("height").replace('px',''),10);
    cnt=cnt+hMsg;

    if (cnt>=650) {
        jQuery('.leftPane').css("height",hPane+hMsg+"px");
    }

  });

   jQuery('#sendLocation').on('click',function (e) {

    e.preventDefault();

    var result=confirm('Your location will now be shared to external users!');

    if (result===true) {

    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      var params=jQuery.deparam(window.location.search);

    socket.emit('location',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude,
      user:params.user,
      room:params.room
    })
  },function () {
    alert('Unable to fetch your location');
  });

}else{
  alert('You denied the permission to share your location');
}

});
