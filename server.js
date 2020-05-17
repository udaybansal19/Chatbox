var express = require('express');
var app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
var socket = require('socket.io');

app.use('/',express.static("Chat"));
app.use('/chat',express.static("Chat"));
app.use('/video',express.static("Video_Call"));


var server = http.createServer({
    key: fs.readFileSync('./tlker.key'),
    cert: fs.readFileSync('./tlker.cert')
}, app)
.listen(80, () =>{
    console.log("Server is running on", server.address().port);
});


//----------Signalling--------------//
var io = socket(server);

io.on("connection", (socket) =>{

    console.log("socket made with " + socket.id);
    socket.on("msg", (data) =>{
            socket.broadcast.emit("msg",data);
            console.log(data);
    });
    socket.on("iceCandidate", (data) =>{
        socket.broadcast.emit("iceCandidate",data);
        console.log(data);
    });
    socket.on("sessionDescriptionOffer", (data) =>{
        socket.broadcast.emit("sessionDescriptionOffer",data);
        console.log(data);
    });
    socket.on("sessionDescriptionAnswer", (data) =>{
        socket.broadcast.emit("sessionDescriptionAnswer",data);
        console.log(data);
    });

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