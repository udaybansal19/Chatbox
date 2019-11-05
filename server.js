var express = require('express');
var app = express();
var socket = require('socket.io');

app.use(express.static("public"));

var server = app.listen(8081, () =>{
    console.log("Server is running on 8081");
});

var io = socket(server);

io.on("connection", (socket) =>{

    console.log("socket made with " + socket.id);
    socket.on("msg", (data) =>{
            io.sockets.emit("msg",data);
            console.log(data);
    });

});