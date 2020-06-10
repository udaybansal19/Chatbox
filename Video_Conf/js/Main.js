//---Configuration and settings---//
var wsUri = "ws://127.0.0.1:8081";
const serverConfig = null;

var constraints = { video: true, audio: false };

const offerOptions = {
	offerToReceiveVideo: 1,
};
//------------------------------//

//---Initialization---//
var localVideo = document.getElementById("localVideo");
var remoteVideos = document.getElementById("video-chat");

const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');

connectButton.disabled = true;
disconnectButton.disabled = true;

connectButton.addEventListener('click', connect);
disconnectButton.addEventListener('click', disconnect);

var myUser = {
	id: null,
	name: 'user'
}

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
	console.log("Signalling Connected");
	connectButton.disabled = false;
	disconnectButton.disabled = false;
}

function onClose(evt) {
	console.log("Signalling Disconnected");
	onLoad();
}

function onMessage(evt) {
	var message = JSON.parse(evt.data);
	var from = message.sender;
	var data = message.data;

	console.log("Received", message.type, "from", from);

	switch (message.type) {
		case 'userData':
			console.log("My id is", data);
			myUser.id = data;
			break;

		case 'currentActive':
			data.forEach((id) => activePeers.add(id));
			break;

		case 'newUser':
			activePeers.add(data);
			if (connectButton.disabled)
				connectTo(data);
			break;

		case 'deleteUser':
			activePeers.delete(data);
			break;

		case 'sessionDescriptionOffer':
			console.log("Received offer from", from);
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
					console.log("ICE candidate added");
				}).catch(error => {
					console.log("Ice candidate error ", error);
				});
			break;

	}
}

function onError(evt) {
	console.log("Signalling Error: ", evt);
}

function connect() {
	connectButton.disabled = true;
	navigator.mediaDevices.getUserMedia(constraints)
		.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

	activePeers.forEach(async (id) => {
		connectTo(id);
	});

}
function gotLocalMediaStream(mediaStream) {
	localStream = mediaStream;
	localVideo.srcObject = mediaStream;
	localVideo.dispatchEvent(localStreamReady);
}
function handleLocalMediaStreamError(error) {
	console.log('navigator.getUserMedia error: ', error);
}

function connectTo(id) {
	console.log("Connecting to", id);
	const peerConnection = new RTCPeerConnection(serverConfig);
	peerConnection.createOffer(offerOptions)
		.then((offer) => {
			console.log("Offer Created");
			peerConnection.setLocalDescription(offer).then(() => {
				console.log("Peer local description set");
			}).catch(error => {
				console.log("Peer connection local description error ", error);
			});
			sendTo('sessionDescriptionOffer', offer, id);
		});
	manageConnection(id, peerConnection);
}

function acceptConnection(id, offer) {
	console.log("Accepting connection from", id);
	const peerConnection = new RTCPeerConnection(serverConfig);
	peerConnection.setRemoteDescription(offer);
	peerConnection.createAnswer()
		.then((answer) => {
			console.log("Answer created");
			peerConnection.setLocalDescription(answer).then(() => {
				console.log("Peer local description set");
			}).catch(error => {
				console.log("Peer connection local description error ", error);
			});
			sendTo('sessionDescriptionAnswer', answer, id);
		});
	manageConnection(id, peerConnection);

}

function manageConnection(id, peerConnection) {
	var remoteStream;
	var remoteVideo = document.createElement("video");
	remoteVideos.appendChild(remoteVideo);

	localVideo.addEventListener('localStreamReady', () => {
		localStream.getTracks().forEach(track => {
			peerConnection.addTrack(track, localStream);
		});
	});

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.addEventListener('iceCandidate', event => {
		if (event.candidate) {
			console.log("Ice Candidate sent to", id);
			sendTo('iceCandidate', event.candidate, id);
		}
	});

	//Add remote Stream
	peerConnection.addEventListener('track', async (event) => {
		console.log("Stream Received of ", id);
		remoteStream.addTrack(event.track, remoteStream);
		event.track.onmute = () => {
			remoteVideo.srcObject = event.streams[0];
		}
	});

	//Connection Complete
	peerConnection.addEventListener('connectionstatechange', event => {
		if (peerConnection.connectionState === 'connected') {
			console.log("WebRTC Connected with ", id);

			remoteVideo.srcObject = peers.get(id).remoteStream;
			remoteVideo.autoplay = true;
			remoteVideo.playsInline = true;
			remoteVideo.muted = true;
		}
	});

	var peer = {
		id: id,
		name: 'user',
		peerConnection: peerConnection,
		remoteStream: remoteStream,
		remoteVideo: remoteVideo
	}
	peers.set(id, peer);
}

function disconnect() {

}

function sendTo(type, data, receiver) {
	if (websocket.readyState === WebSocket.OPEN) {
		const message = {
			type: type,
			sender: myUser.id,
			receiver: receiver,
			data: data
		}
		console.log("Sending", type, "to", receiver);
		try {
			websocket.send(JSON.stringify(message));
		} catch (error) {
			console.log("Failed to communicate with server with Error", error);
		}
	}
}