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

startButton.addEventListener('click', startStream);
stopButton.addEventListener('click', disconnect);

var myUser = {
	id: null,
	name: 'user'
}

const log = {
	error:1,
	warn:2,
	log:3,
	info:4,
	debug:5
}
Object.freeze(log);

var localStream;
var activePeers = new Set();
var peers = new Map();
var localStreamReady = new Event('localStreamReady');
//---------//

window.addEventListener('load', onLoad);

function onLoad() {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function (evt) { onOpen(evt) };
	websocket.onclose = function (evt) { onClose(evt) };
	websocket.onmessage = function (evt) { onMessage(evt) };
	websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
	logger("Signalling Connected",log.info);
	startButton.disabled = false;
	stopButton.disabled = false;
}

function onClose(evt) {
	logger("Signalling Disconnected",log.info);
	onLoad();
}

function onMessage(evt) {
	var message = JSON.parse(evt.data);
	var from = message.sender;
	var data = message.data;

	logger("Received " +  message.type + " from " + from,log.log);

	switch (message.type) {
		case 'userData':
			logger("My id is " + data,log.info);
			myUser.id = data;
			break;

		case 'currentActive':
			data.forEach((id) => {
				activePeers.add(id);
			});
			break;

		case 'newUser':
			activePeers.add(data);
			connectTo(data);
			break;

		case 'deleteUser':
			activePeers.delete(data);
			break;

		case 'sessionDescriptionOffer':
			logger("Received offer from" + from,log.log);
			var offer = data;
			if (offer) {
				acceptConnection(from, offer);
			}
			break;

		case 'sessionDescriptionAnswer':
			var answer = data;
			if (answer) {
				peers.get(from).peerConnection.setRemoteDescription(answer);
			}
			break;

		case 'iceCandidate':
			peers.get(from).peerConnection.addIceCandidate(data)
				.then(() => {
					logger("ICE candidate added", log.log);
				}).catch(error => {
					logger("Ice candidate error " + error, log.error);
				});
			break;

	}
}

function onError(evt) {
	logger("Signalling Error: " + evt, log.error);
}

function startStream() {
	startButton.disabled = true;
	navigator.mediaDevices.getUserMedia(constraints)
		.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}
function gotLocalMediaStream(mediaStream) {
	localStream = mediaStream;
	localVideo.srcObject = mediaStream;
	localVideo.dispatchEvent(localStreamReady);
	//TODO: Add stream to the all the rtc connection and renegotiate offers
}
function handleLocalMediaStreamError(error) {
	logger('navigator.getUserMedia error: ' + error, log.error);
}

function connectTo(id) {
	logger("Connecting to" + id, log.log);
	const peerConnection = new RTCPeerConnection(serverConfig);
	const dataChannel = peerConnection.createDataChannel("DataChannel");
	dataTransfer(id, dataChannel);
	peerConnection.createOffer(offerOptions)
		.then((offer) => {
			peerConnection.setLocalDescription(offer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionOffer', offer, id);
		});

	manageConnection(id, peerConnection);
}

function acceptConnection(id, offer) {
	logger("Accepting connection from" + id, log.log);
	const peerConnection = new RTCPeerConnection(serverConfig);
	
	peerConnection.addEventListener('datachannel', event => {
		const dataChannel = event.channel;
		dataTransfer(id,dataChannel);
	});
	peerConnection.setRemoteDescription(offer);
	peerConnection.createAnswer()
		.then((answer) => {
			peerConnection.setLocalDescription(answer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionAnswer', answer, id);
		});
	manageConnection(id, peerConnection);
}

function dataTransfer(id, dataChannel) {
	dataChannel.addEventListener('open', event => {
		logger("Data Channel opened with: " + id, log.debug);
		dataChannel.send("Hello From " + myUser.id);
	});
	
	dataChannel.addEventListener('close', event => {
		logger("Data Channel closed with: " + id, log.debug);
	});

	dataChannel.addEventListener('message', event => {
		const message = event.data;
		logger("Received" + message, log.debug);
	});

}

function manageConnection(id, peerConnection) {

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			sendTo('iceCandidate', event.candidate, id);
		}
	};

	//WebRTC connection status
	peerConnection.addEventListener('connectionstatechange', event => {
		switch(peerConnection.connectionState) {
			case 'connected':
				logger("WebRTC Connected with " + id, log.info);
				break;
			case 'disconnected':
				logger("WebRTC Disonnected with " + id, log.info);
				break;
			default:
				break;			
		}
	});

	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		// remoteStream: remoteStream,
		// remoteVideo: remoteVideo
	}
	peers.set(id, peer);
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
		} catch (error) {
			logger("Failed to communicate with server with Error" + error, log.error);
		}
	}
}


function logger(message, type) {
	switch(type) {
		case 1:
			console.error(message);
			break;

		case 2:
			console.warn(message);
			break;

		case 3:
			//console.log(message);
			break;

		case 4:
			console.log(`%c ${message}`,"color:Chartreuse");
			break;

		case 5:
			console.log(`%c ${message}`,"color:yellow");
			break;

		default:
			console.log(message);
			break;
	}

}