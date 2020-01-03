var socket = io.connect("http://192.168.1.13:8081/");

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");
var constraints = { video : true };

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    socket.emit("peerID",peer.id); 
  });
  

// send.addEventListener("click", ()=>{
//     socket.emit("msg",message.value);
//     message.value = "";
// });

// socket.on("msg", (data) => {
//     output.innerHTML += "<p>" + data + "</p>";
// });

var f = 1;

socket.on("peerID",(data) => {
    if(data != peer.id && data != null){
        console.log("Peer Found: " + data);
        console.log("flag");
      var conn = peer.connect(data);
      //sender
      f=0;
      console.log(sender);
      messaging(conn);
    }
});

if(f){
    //receiver
    peer.on('connection', function(conn) {
        console.log("receiver");
        messaging(conn);
      });

}

function messaging(conn){
    conn.on('open',() =>{

      send.addEventListener("click", ()=>{
          conn.send(message.value);
          output.innerHTML += "<p>" + message.value + "</p>";
          message.value = "";
      });

      conn.on('data', function(data) {
          output.innerHTML += "<p>" + data + "</p>";
      });

    });

}

// peer.on('connection', function(conn) {
//   console.log("connection");
//   conn.on('open', function() {
//     // Receive messages
//     conn.on('data', function(data) {
//         console.log("received");
//       console.log('Received', data);
//     });
  
//     // Send messages
//     console.log("send");
//     conn.send('Hello!!!!!!!!');
//   });
// });

// function successCallback(stream){
//     var video = document.getElementById("webcam");
//     video.srcObject = stream;
// }

// function errorCallback(error) {
//     console.log("navigator.getUserMedia: ",error);
// }    
// navigator.getUserMedia(constraints,successCallback,errorCallback);