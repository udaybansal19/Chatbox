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
	startButton.disabled = false;
	stopButton.disabled = false;
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
			console.log("%cMy id is " + data,"color:Gold");
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
	console.log("%cLocal stream event dispached","color:Aqua");
}
function handleLocalMediaStreamError(error) {
	console.log('navigator.getUserMedia error: ', error);
}

function connectTo(id) {
	console.log("Connecting to", id);
	const peerConnection = new RTCPeerConnection(serverConfig);
	const dataChannel = peerConnection.createDataChannel("DataChannel");
	dataTransfer(id, dataChannel);
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
	
	peerConnection.addEventListener('datachannel', event => {
		const dataChannel = event.channel;
		console.log("%cFLAG","color:red");
		console.log(dataChannel);
		dataTransfer(id,dataChannel);
	});
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

function dataTransfer(id, dataChannel) {
	dataChannel.addEventListener('open', event => {
		console.log("%cData Channel opened with: " + id,"color:red");
		dataChannel.send("Hello From " + myUser.id);
	});
	
	dataChannel.addEventListener('close', event => {
		console.log("%cData Channel closed with: " + id,"color:red");
	});

	dataChannel.addEventListener('message', event => {
		const message = event.data;
		console.log("%c Received" + message,"color:red");
	});

}

function manageConnection(id, peerConnection) {
	// var remoteStream;
	// var remoteVideo = document.createElement("video");
	// remoteVideos.appendChild(remoteVideo);

	// localVideo.addEventListener('localStreamReady', () => {
	// 	localStream.getTracks().forEach(track => {
	// 		peerConnection.addTrack(track,localStream);
	// 		console.log("%cAdded track","color:Aqua");
	// 		console.log(track);
	// 		console.log(peerConnection.getRemoteStreams());
	// 		console.log(peerConnection.getLocalStreams());
	// 	});
	// });

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			console.log("Ice Candidate sent to", id);
			sendTo('iceCandidate', event.candidate, id);
		}
	};

	peerConnection.addEventListener("iceconnectionstatechange", ev => {
		console.log("%cIceConnection State changed to: " + peerConnection.iceConnectionState,"color:yellow");
	});
	console.log("%cIceConnection initial state: " + peerConnection.iceConnectionState,"color:green");
	

	peerConnection.addEventListener("icegatheringstatechange", ev => {
		console.log("%cIce Gathering State changed to: " + peerConnection.iceGatheringState,"color:yellow");
	});
	console.log("%cIce Gathering inital state: " + peerConnection.iceGatheringState,"color:green");



	// //Add remote Stream
	// peerConnection.addEventListener('track', (event) => {
	// 	console.log("%cStream Received of " + id,"color:Aqua");
	// 	remoteStream.addTrack(event.track);
	// 	remoteVideo.srcObject = event.streams[0];
	// 	// event.track.onmute = () => {
	// 	// 	remoteVideo.srcObject = event.streams[0];
	// 	// }
	// });
	// peerConnection.ontrack = (event) => {
	// 	console.log("%cStream Received of " + id,"color:Aqua");
	// 	remoteStream.addTrack(event.track);
	// 	remoteVideo.srcObject = event.streams[0];
	// 	// event.track.onmute = () => {
	// 	// 	remoteVideo.srcObject = event.streams[0];
	// 	// }
	// };


	//WebRTC connection status
	peerConnection.addEventListener('connectionstatechange', event => {
		switch(peerConnection.connectionState) {
			case 'connected':
				console.log("%cWebRTC Connected with " + id,"color:Chartreuse");
				break;
			case 'disconnected':
				console.log("%cWebRTC Disonnected with " + id,"color:Chartreuse");
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