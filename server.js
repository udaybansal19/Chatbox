var express = require('express');
var app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');

app.use('/',express.static("Chat"));
app.use('/chat',express.static("Chat"));
app.use('/video',express.static("Video_Call"));


var server = http.createServer(app)
.listen(8081, () =>{
    console.log("Server is running on", server.address().port);
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({server});
var USERS = new Set();

var visitorsNum = 0;

wss.on('connection', ws => {

  visitorsNum++;

  var user = {
    name: "user",
    id: visitorsNum,
    client: ws
  };

  USERS.add(user);
  console.log("New Connection opened: ID",visitorsNum);

  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          try {
            client.send(message);
          } catch(error) {
            console.log("Failed to send message of user"
            ,user.id, "with Error", error);
          }
        }
    });
  });

  ws.on('close', () => {
    console.log(user.id,"Closed");
    USERS.delete(user);
  });

  ws.on('error',  error => {
    console.log("Error: ",error);
  });

});