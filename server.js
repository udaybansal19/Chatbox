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

var firebaseConfig = {
    apiKey: "AIzaSyCeUDv1aYk2SbhHhM_C7AZvLjrsI6H_XHU",
    authDomain: "chatbox-3bafb.firebaseapp.com",
    databaseURL: "https://chatbox-3bafb.firebaseio.com",
    projectId: "chatbox-3bafb",
    storageBucket: "chatbox-3bafb.appspot.com",
    messagingSenderId: "426689793721",
    appId: "1:426689793721:web:ed37cb7f2d52c92c741568",
    measurementId: "G-WLJM0X1KM9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();