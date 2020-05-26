var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

const startButton = document.getElementById('startButton');
//const callButton = document.getElementById('callButton');
const acceptButton = document.getElementById('acceptButton');
const hangupButton = document.getElementById('hangupButton');

// Add click event handlers for buttons.
startButton.addEventListener('click', startAction);
//callButton.addEventListener('click', callAction);
acceptButton.addEventListener('click', startAction);
hangupButton.addEventListener('click', hangupAction);

var constraints = { video : true , audio : false };

var serverConfig = null;
const peerConnection = new RTCPeerConnection(serverConfig);

const offerOptions = {
  offerToReceiveVideo: 1,
};

var localStream;
var remoteStream = new MediaStream();

window.addEventListener("load", onLoad);

function onLoad() {
    var wsUri = "ws://127.0.0.1:8081";
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
  console.log("Signalling Connected");
}
    
function onClose(evt) {
  console.log("Signalling Disconnected");
}
    
function onMessage(evt) {
  var message = JSON.parse(evt.data);

  if(message.type === 'sessionDescriptionOffer' ){
    var offer = message.data;
    if(offer){
        peerConnection.setRemoteDescription(offer);
        peerConnection.createAnswer().then((answer)=> {
            console.log("Answer Created");
            send("sessionDescriptionAnswer", answer);
                peerConnection.setLocalDescription(answer).then(()=>{
                    console.log("Peer local description set");
                }).catch(error => {
                    console.log("Peer connection local description error ",error);
                });
        });
    }
  }

  if(message.type === 'sessionDescriptionAnswer' ){
    var answer = message.data;
    if(answer) {
            console.log("Session Description Response Received");
            //const remoteDesc = new RTCSessionDescription(message);
            peerConnection.setRemoteDescription(answer).then(()=>{
                console.log("Peer remote description set");
              }).catch(error => {
                console.log("Peer connection remote description error ",error);
              });
        }
  }

  if(message.type === 'iceCandidate' ){
    var iceCandidateData = message.data;
    peerConnection.addIceCandidate(iceCandidateData)
        .then( () =>{
            console.log("ICE candidate added");
        }).catch(error => {
            console.log("Ice candidate error ",error);
    });
  }

}
    
function onError(evt) {
  console.log("Error: ", evt);
}


  //Setting local stream.
  function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
    callAction();
  }

  // Error message for local stream.
  function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

// Handles start button action: creates local MediaStream.
function startAction() {
  startButton.disabled = true;
  acceptButton.disabled = true;
  console.log("Local stream added");
  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}

async function callAction() {
    console.log("Call Action start");
    //peerConnection.addStream(localStream);
    const offer = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer);
    send('sessionDescriptionOffer',offer);
    console.log("Session Description offer sent");

}

//Ice Candidate
//sending iceCandidate data
peerConnection.addEventListener('icecandidate', event => {
    if(event.candidate) {
        console.log("Ice Candidate sent");
        send('iceCandidate', event.candidate);
    }
});

//Connection complete listener
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
    console.log("WebRTC Connected");
    }
});

//Add remote stream to DOM object at sender's side
peerConnection.addEventListener('track', async (event) => {
    console.log("Stream received");
    remoteVideo.srcObject = remoteStream;
    remoteStream.addTrack(event.track, remoteStream);
});

  function hangupAction() {
    peerConnection.close();
  }

  function send(type, data) {
    if (websocket.readyState === WebSocket.OPEN) {
      const message = {
        type : type,
        data : data
      }
      websocket.send(JSON.stringify(message));
   }
  }