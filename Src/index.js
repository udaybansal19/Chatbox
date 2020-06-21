const connectus = require('C:\\Users\\dell\\Downloads\\connectUs');
const webrtcAdapter = require('webrtc-adapter');

var wsUri = "ws://127.0.0.1:8080"

window.addEventListener('load', connectus.start(wsUri));

var localVideo = document.getElementById("localVideo");
var remoteVideos = document.getElementById("video-chat");
connectus.setRemoteVideosContainer(remoteVideos);

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

// Add click event handlers for buttons.
startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);

var constraints = { video : true , audio : false };

var localStream;

function start() {
    startButton.disabled = true;
    navigator.mediaDevices.getUserMedia(constraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}

//Setting local stream.
function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
    console.log(localStream);
    console.log(localStream.getTracks());
    connectus.addLocalStream(localStream.getTracks(), localStream);
  }

  // Error message for local stream.
  function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

function stop() {

}