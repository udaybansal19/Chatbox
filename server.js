var express = require('express');
var app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
var socket = require('socket.io');

app.use('/',express.static("Chat"));
app.use('/chat',express.static("Chat"));
app.use('/video',express.static("Video_Call"));


var server = http.createServer(app)
.listen(8081, () =>{
    console.log("Server is running on", server.address().port);
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({server});
var CLIENTS=[];

wss.on('connection', ws => {
    CLIENTS.push(ws);
    console.log("New Connection: ID",CLIENTS.length);
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
    });
  });
});