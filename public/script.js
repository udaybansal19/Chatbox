var socket = io.connect("http://192.168.43.137:8081/");

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");
var constraints = { video : true };

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

  var conn = peer.connect('dest-peer-id');

  

send.addEventListener("click", ()=>{
    socket.emit("msg",message.value);
    message.value = "";
});

socket.on("msg", (data) => {
    output.innerHTML += "<p>" + data + "</p>";
});

// function successCallback(stream){
//     var video = document.getElementById("webcam");
//     video.srcObject = stream;
// }

// function errorCallback(error) {
//     console.log("navigator.getUserMedia: ",error);
// }    
// navigator.getUserMedia(constraints,successCallback,errorCallback);