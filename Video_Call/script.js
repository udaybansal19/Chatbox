var socket = io.connect("http://192.168.1.16:8081/",{secure : true});

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var constraints = { video : true , audio : false };

var localStream;
var remoteStream;


// send.addEventListener("click", ()=>{
//     socket.emit("msg",message.value);
//     message.value = "";
// });

// socket.on("msg", (data) => {
//     output.innerHTML += "<p>" + data + "</p>";
// });


//------Getting Local stream-------//

//Setting local stream.
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// Error message for local stream.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

//Getting local stream.
navigator.mediaDevices.getUserMedia(constraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

//-----------------------------------//



