//---Configuration and settings---//
var wsUri = "ws://127.0.0.1:8080";
const serverConfig = null;

var constraints = { video: true, audio: false };

const offerOptions = {
	offerToReceiveVideo: 1,
};
//------------------------------//

//---Initialization---//
var localVideo = document.getElementById("localVideo");
var remoteVideos = document.getElementById("video-chat");

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

startButton.disabled = true;
stop.disabled = true;

//startButton.addEventListener('click', startStream);
stopButton.addEventListener('click', disconnect);

var myUser = {
	id: null,
	name: 'user'
}

var localStream;
var activePeers = new Set();
var peers = new Map();
var localStreamReady = new Event('localStreamReady');
//---------//


// function startStream() {
// 	startButton.disabled = true;
// 	navigator.mediaDevices.getUserMedia(constraints)
// 		.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
// }
// function gotLocalMediaStream(mediaStream) {
// 	localStream = mediaStream;
// 	localVideo.srcObject = mediaStream;
// 	localVideo.dispatchEvent(localStreamReady);
// 	//TODO: Add stream to the all the rtc connection and renegotiate offers
// }
// function handleLocalMediaStreamError(error) {
// 	logger('navigator.getUserMedia error: ' + error, log.error);
// }


function connectTo(id) {
	logger("Connecting to" + id, log.log);
	const peerConnection = new RTCPeerConnection(serverConfig);
	const dataChannel = peerConnection.createDataChannel("DataChannel");
	dataTransfer(id, dataChannel);
	createOffer(id, peerConnection);
	manageConnection(id, peerConnection);
}

function acceptConnection(id, offer) {
	logger("Accepting connection from" + id, log.log);
	const peerConnection = new RTCPeerConnection(serverConfig);
	
	peerConnection.addEventListener('datachannel', event => {
		const dataChannel = event.channel;
		dataTransfer(id,dataChannel);
	});

	createAnswer(id, peerConnection, offer);
	manageConnection(id, peerConnection);
}

function disconnect() {
	//TODO
}
