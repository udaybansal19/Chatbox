var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

// Define action buttons.
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

// Set up initial action buttons status: disable call and hangup.
//callButton.disabled = true;
//hangupButton.disabled = true;

// Add click event handlers for buttons.
startButton.addEventListener('click', startAction);
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupAction);

var constraints = { video : true , audio : false };
var serverConfig = null;
const offerOptions = {
  offerToReceiveVideo: 1,
};

var localStream;
var remoteStream;

//------------Signalling------------//
//var socket = io.connect("http://192.168.1.16:8081/",{secure : true});



//---------------------------------//



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

//-----------------------------------//

// Handles start button action: creates local MediaStream.
function startAction() {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}

 async function callAction() {	
   console.log("Call Action Start");
	//Local
  const localPeerConnection = new RTCPeerConnection(serverConfig);
  localPeerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
		remotePeerConnection.addIceCandidate(event.candidate)
			.then( () =>{
				console.log("Local ICE candidate added");
			}).catch(error => {
				console.log("Local Ice candidate error ",error);
			});
    }
  });

	//Remote
  const remotePeerConnection = new RTCPeerConnection(serverConfig);
  remotePeerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
		localPeerConnection.addIceCandidate(event.candidate)
		.then( ()=> {
			console.log("Remote ICE candidate added");
		}).catch(error => {
			console.log("Remote Ice candidate error ",error);
		});
    }
 });

 localPeerConnection.addEventListener('connectionstatechange', event => {
      if (localPeerConnection.connectionState === 'connected') {
      console.log("Connected");
      }
  });

  remotePeerConnection.addEventListener('addstream', (event) => {
    console.log("AddStream event detected");
	  remoteVideo.srcObject = event.stream;
	  remoteStream = event.stream;
  } );
  
  localPeerConnection.addStream(localStream);

  localPeerConnection.createOffer(offerOptions).then((desc)=>{
      console.log("Offer Created");
      localPeerConnection.setLocalDescription(desc).then(()=>{
        console.log("Local Peer local description set");
      }).catch(error => {
        console.log("Local peer connection local description error ",error);
      });
      remotePeerConnection.setRemoteDescription(desc).then(()=>{
        console.log("Remote Peer remote description set");
      }).catch(error => {
        console.log("Remote peer connection remote description error ",error);
      });

      remotePeerConnection.createAnswer().then((ans)=> {
        console.log("Answer Created");
        remotePeerConnection.setLocalDescription(ans).then(()=>{
          console.log("Remote Peer local description set");
        }).catch(error => {
          console.log("Remote peer connection local description error ",error);
        });
        localPeerConnection.setRemoteDescription(ans).then(()=>{
          console.log("Local Peer remote description set");
        }).catch(error => {
          console.log("Local peer connection remote description error ",error);
        });
      });
  });


  
}
function hangupAction() {

}



