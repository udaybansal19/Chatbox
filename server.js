var express = require('express');
var app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
var socket = require('socket.io');

app.use(express.static("public"));

var server = http.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app)
.listen(8081, () =>{
    console.log("Server is running on 8081");
});

var io = socket(server);

io.on("connection", (socket) =>{

    console.log("socket made with " + socket.id);
    socket.on("msg", (data) =>{
            io.sockets.emit("msg",data);
            console.log(data);
    });
    var c=0;
    if(c==0)
    socket.on("peerID", (data) =>{
        console.log("The peer ID is: " + data);
        io.sockets.emit("peerID",data);
        c++;
});

});