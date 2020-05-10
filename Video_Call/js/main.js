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

var socket = io.connect("http://192.168.1.16:8081/",{secure : true});


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
    console.log("Session Description offer sent");
    socket.emit("sessionDescriptionOffer", offer);

    socket.on("sessionDescriptionAnswer", answer => {
        if(answer) {
            console.log("Session Description Response Received");
            //const remoteDesc = new RTCSessionDescription(message);
            peerConnection.setRemoteDescription(answer).then(()=>{
                console.log("Peer remote description set");
              }).catch(error => {
                console.log("Peer connection remote description error ",error);
              });
        }
    });

}

socket.on("sessionDescriptionOffer", offer => {
    if(offer){
        peerConnection.setRemoteDescription(offer);
        peerConnection.createAnswer().then((answer)=> {
            console.log("Answer Created");
            socket.emit("sessionDescriptionAnswer", answer);
                peerConnection.setLocalDescription(answer).then(()=>{
                    console.log("Peer local description set");
                }).catch(error => {
                    console.log("Peer connection local description error ",error);
                });
        });
    }
});

//Ice Candidate
//sending iceCandidate data
peerConnection.addEventListener('icecandidate', event => {
    if(event.candidate) {
        console.log("Ice Candidate sent");
        socket.emit('iceCandidate', event.candidate);
    }
});

 //receiving iceCandidate data
 socket.on('iceCandidate', async iceCandidateData =>{
    peerConnection.addIceCandidate(iceCandidateData)
        .then( () =>{
            console.log("ICE candidate added");
        }).catch(error => {
            console.log("Ice candidate error ",error);
    });
});

//Connection complete listener
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
    console.log("Connected");
    }
});

//Add remote stream to DOM object at receiving end
// peerConnection.addEventListener('addstream', (event) => {
//     console.log("AddStream event detected");
//     remoteVideo.srcObject = event.stream;
//     remoteStream = event.stream;
//   } );

//Add remote stream to DOM object at sender's side
peerConnection.addEventListener('track', async (event) => {
    console.log("Stream received");
    remoteVideo.srcObject = remoteStream;
    remoteStream.addTrack(event.track, remoteStream);
});

  function hangupAction() {

  }