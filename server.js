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
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app)
.listen(8081, () =>{
    console.log("Server is running on 8081");
});


//----------Signalling--------------//
var io = socket(server);

io.on("connection", (socket) =>{

    console.log("socket made with " + socket.id);
    socket.on("msg", (data) =>{
            socket.broadcast.emit("msg",data);
            console.log(data);
    });
});