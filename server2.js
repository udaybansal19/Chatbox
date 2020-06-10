var express = require('express');
var app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');

app.use('/',express.static("Chat"));
app.use('/chat',express.static("Chat"));
app.use('/video',express.static("Video_Call"));
app.use('/conf', express.static("Video_Conf"));


var server = http.createServer(app)
.listen(8081, () =>{
    console.log("Server is running on", server.address().port);
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({server});
var activeUsers = new Set();
var userList = new Map();

var visitorsNum = 0;

wss.on('connection', ws => {

  visitorsNum++;

  var user = {
    name: 'user',
    id: visitorsNum,
    client: ws
  };

  //On connection open
  sendTo('userData',user.id,0);
  var existingUsers = [];
  activeUsers.forEach((userId) => existingUsers.push(userId));
  sendTo('currentActive',existingUsers,0);

  sendTo('newUser',user.id,-1);

  activeUsers.add(user.id);
  userList.set(user.id, user);
  console.log("New Connection opened: ID",visitorsNum);

  ws.on('message', message => {
   var type = JSON.parse(message).type;
   var data = JSON.parse(message).data;
   var recveiver = JSON.parse(message).receiver;
   
   sendTo(type,data,recveiver);
  });

  ws.on('close', () => {
    console.log(user.id,"Closed");
    sendTo('deleteUser',user.id,-1);
    activeUsers.delete(user.id);
  });

  ws.on('error',  error => {
    console.log("Error: ",error);
  });

  function sendTo(type, data, receiver) {
    
    const message = JSON.stringify({
      type      :   type,
      sender    :   user.id,
      data      :   data
    });

    //  -1  ->  Send to All
    //  0   ->  Send to self
    //  >0  ->  Send to given id

    switch(receiver) {
      
      case -1:
        wss.clients.forEach( function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            try {
              client.send(message);
            } catch(error) {
              console.log("Failed to send message of user"
              ,user.id, "with Error", error);
            }
          }
        });
        break;

      case 0:
        ws.send(message);
        break;

      default :
        (userList.get(receiver)).client.send(message);
        break;

    }
  } 

});