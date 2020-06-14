function createOffer(id) {
	const peerConnection = peers.get(id).peerConnection;
    peerConnection.createOffer(offerOptions)
		.then((offer) => {
			peerConnection.setLocalDescription(offer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionOffer', offer, id);
		});
}

function createAnswer(id, offer) {
	const peerConnection = peers.get(id).peerConnection;
    peerConnection.setRemoteDescription(offer);
	peerConnection.createAnswer()
		.then((answer) => {
			peerConnection.setLocalDescription(answer).then(() => {
			}).catch(error => {
				logger("Peer connection local description error " + error, log.error);
			});
			sendTo('sessionDescriptionAnswer', answer, id);
		});
}

//To decode message received from signalling
function receivedMessage(message) {
    var from = message.sender;
    var data = message.data;
    var type = message.type;

	logger("Received " +  type + " from " + from,log.log);

	switch (type) {
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

function manageConnection(id) {

	const peerConnection = peers.get(id).peerConnection;

	//Ice Candidate
	//sending iceCandidate data
	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			sendTo('iceCandidate', event.candidate, id);
		}
	};

	// peerConnection.addEventListener("negotiationneeded", ev => {
	// 	logger("Negotiation Needed", log.debug);
	// });

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

}