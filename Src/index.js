const connectus = require('C:\\Users\\dell\\Downloads\\connectUs');
const adapter = require('webrtc-adapter');
const { toInteger } = require('lodash');

var wsUri = "ws://127.0.0.1:8080"

window.addEventListener('load', connectus.start(wsUri));

var localVideo = document.getElementById("localVideo");
var remoteVideos = document.getElementById("video-chat");
var connectTo = document.getElementById("connectTo");
connectus.setRemoteVideosContainer(remoteVideos);

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const connectToButton = document.getElementById('connectToButton');

// Add click event handlers for buttons.
startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);
connectToButton.addEventListener('click', connect);

var constraints = { video : true , audio : false };

var localStream;

function start() {
    startButton.disabled = true;
    navigator.mediaDevices.getUserMedia(constraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}

function connect() {
    console.log(connectTo.value);
    connectus.connectTo(toInteger(connectTo.value));
}

//Setting local stream.
function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
    connectus.addLocalStream(localStream.getTracks(), localStream);
  }

  // Error message for local stream.
  function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

function stop() {

}