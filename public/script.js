//var socket = io.connect("http://192.168.1.13:8081/");

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");
var constraints = { video : true };

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    //socket.emit("peerID",peer.id);
    peer.on('connection', function(conn) {
      console.log("receiver");
      messaging(conn);
    });
  });
  

// send.addEventListener("click", ()=>{
//     socket.emit("msg",message.value);
//     message.value = "";
// });

// socket.on("msg", (data) => {
//     output.innerHTML += "<p>" + data + "</p>";
// });

var f = 1;

var mediaStream;

function successCallback(stream){
  var video = document.getElementById("webcam");
  video.srcObject = stream;
  mediaStream = stream;
}

function errorCallback(error) {
  console.log("navigator.getUserMedia: ",error);
}    
// var getUserMedia = navigator.getUserMedia(constraints,successCallback,errorCallback) || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// var mediaStream = navigator.mediaDevices.getUserMedia(constraints)
// .then(function(stream) {
//   /* use the stream */
//   var video = document.getElementById("webcam");
//   video.srcObject = stream;
//   mediaStream = stream;
// })
// .catch(function(err) {
//   /* handle the error */
//   console.log("Error in getUserMedia");
// });

var connect = document.getElementById("connect");

connect.addEventListener("click", () => {
  var deviceID = document.getElementById("device-id");
  var conn = peer.connect(deviceID.value);
  //sender
 // f=0;
  console.log("sender");
  messaging(conn); 
});
// socket.on("peerID",(data) => {
//     if(data != peer.id && data != null){
//         console.log("Peer Found: " + data);
//       var conn = peer.connect(data);
//       //sender
//       f=0;
//       console.log("sender");
//       messaging(conn);

//      // getUserMedia({video: true, audio: true}, function(stream) {
//         // var call = peer.call(data, mediaStream);
//         // videoCalling(call);
//   //});
//  }
//   if(f){
//     //receiver
//     peer.on('connection', function(conn) {
//         console.log("receiver");
//         messaging(conn);
//       });

//       peer.on('call', function(call) {
//         // Answer the call, providing our mediaStream
//         //getUserMedia({video: true, audio: true}, function(stream) {
//         //   call.answer(mediaStream); // Answer the call with an A/V stream.
//         // videoCalling(call);

//         //});
//       });
//   }
// });


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

function videoCalling(call) {
  console.log("flag");
  console.log(call);
  call.on('stream', function(remoteStream) {
    // Show stream in some video/canvas element.
    var callVideo = document.getElementById("peer-webcam");
     callVideo.srcObject = remoteStream;
  });
  // call.on('stream', function(stream) {
  //   // `stream` is the MediaStream of the remote peer.
  //   // Here you'd add it to an HTML video/canvas element.
  //   var callVideo = document.getElementById("peer-webcam");
  //    callVideo.srcObject = stream;
  // });
}
