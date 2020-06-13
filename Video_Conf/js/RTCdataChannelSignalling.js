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