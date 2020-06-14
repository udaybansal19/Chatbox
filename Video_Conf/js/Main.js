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

function initPeer(id) {

	const peerConnection = new RTCPeerConnection(serverConfig);
	
	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		dataChannel: null,
		// remoteStream: remoteStream,
		// remoteVideo: remoteVideo
	}
	peers.set(id, peer);
}

function connectTo(id) {
	logger("Connecting to" + id, log.log);
	
	initPeer(id);
	peers.get(id).dataChannel = peers.get(id).peerConnection.createDataChannel("DataChannel");
	dataTransfer(id);
	createOffer(id);
	manageConnection(id);
}

function acceptConnection(id, offer) {
	logger("Accepting connection from" + id, log.log);
	
	initPeer(id);
	
	peers.get(id).peerConnection.addEventListener('datachannel', event => {
		peers.get(id).dataChannel = event.channel;
		dataTransfer(id);
	});

	createAnswer(id, offer);
	manageConnection(id,);
}

function disconnect() {
	//TODO
}

function sendTo(type, data, receiver) {
	if (websocket.readyState === WebSocket.OPEN) {
		const message = {
			type: type,
			sender: myUser.id,
			receiver: receiver,
			data: data
		}
		try {
			websocket.send(JSON.stringify(message));
			logger("Sending " + type + " to " + receiver, log.log);
		} catch (error) {
			logger("Failed to communicate with server with Error" + error, log.error);
		}
	}
}
