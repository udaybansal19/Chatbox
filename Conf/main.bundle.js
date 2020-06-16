/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Src/Main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Src/Main.js":
/*!*********************!*\
  !*** ./Src/Main.js ***!
  \*********************/
/*! exports provided: wsUri, myUser, activePeers, connectTo, acceptOffer, acceptAnswer, addIceCandidateToPeer, getPeer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"wsUri\", function() { return wsUri; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"myUser\", function() { return myUser; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"activePeers\", function() { return activePeers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"connectTo\", function() { return connectTo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"acceptOffer\", function() { return acceptOffer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"acceptAnswer\", function() { return acceptAnswer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addIceCandidateToPeer\", function() { return addIceCandidateToPeer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getPeer\", function() { return getPeer; });\n/* harmony import */ var _Signalling_Signalling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Signalling/Signalling */ \"./Src/Signalling/Signalling.js\");\n/* harmony import */ var _Signalling_RTCdataChannelSignalling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Signalling/RTCdataChannelSignalling */ \"./Src/Signalling/RTCdataChannelSignalling.js\");\n/* harmony import */ var _rtc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rtc */ \"./Src/rtc.js\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ \"./Src/logger.js\");\n\r\n\r\n\r\n\r\n\r\n//---Configuration and settings---//\r\nconst wsUri = \"ws://127.0.0.1:8080\";\r\nconst serverConfig = null;\r\n\r\nvar constraints = { video: true, audio: false };\r\n\r\n//------------------------------//\r\n\r\n//---Initialization---//\r\nvar localVideo = document.getElementById(\"localVideo\");\r\nvar remoteVideos = document.getElementById(\"video-chat\");\r\n\r\nconst startButton = document.getElementById('startButton');\r\nconst stopButton = document.getElementById('stopButton');\r\n\r\nstartButton.disabled = true;\r\nstop.disabled = true;\r\n\r\n//startButton.addEventListener('click', startStream);\r\nstopButton.addEventListener('click', disconnect);\r\n\r\nvar myUser = {\r\n\tid: null,\r\n\tname: 'user'\r\n}\r\n\r\n//Signalling codes\r\nconst signallingMethod = {\r\n\twebsockets: 1,\r\n\tdataChannel: 2,\r\n\troutingChannel: 3 \r\n}\r\nObject.freeze(signallingMethod);\r\n\r\nvar activePeers = new Set();\r\nvar peers = new Map();\r\n\r\n//To Start Signalling on load.\r\nwindow.addEventListener('load', onLoad);\r\n\r\n//---------//\r\n\r\nfunction onLoad() {\r\n\tObject(_Signalling_Signalling__WEBPACK_IMPORTED_MODULE_0__[\"initSignalling\"])();\r\n}\r\n\r\nfunction initPeer(id) {\r\n\r\n\tconst peerConnection = new RTCPeerConnection(serverConfig);\r\n\t\r\n\tvar peer = {\r\n\t\tid: id,\r\n\t\tname: 'user',\r\n\t\tpeerConnection: peerConnection,\r\n\t\tdataChannel: null,\r\n\t\tsignallingMethod: signallingMethod.websockets,\r\n\t}\r\n\tpeers.set(id, peer);\r\n\r\n\treturn peer;\r\n}\r\n\r\nfunction connectTo(id) {\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(\"Connecting to\" + id, log.log);\r\n\t\r\n\tvar peer = initPeer(id);\r\n\tpeer.dataChannel = peer.peerConnection.createDataChannel(\"DataChannel\");\r\n\t\r\n\tObject(_Signalling_RTCdataChannelSignalling__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(peer);\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"createOffer\"](peer);\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"manageConnection\"](peer);\r\n}\r\n\r\nfunction acceptOffer(id, offer) {\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(\"Accepting connection from\" + id, log.log);\r\n\t\r\n\tvar peer = initPeer(id);\r\n\t\r\n\tpeer.peerConnection.addEventListener('datachannel', event => {\r\n\t\tpeer.dataChannel = event.channel;\r\n\t\tObject(_Signalling_RTCdataChannelSignalling__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(peer);\r\n\t});\r\n\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"createAnswer\"](peer, offer);\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"manageConnection\"](peer);\r\n}\r\n\r\nfunction acceptAnswer(id, answer) {\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"acceptAnswer\"](peers.get(id), answer);\r\n}\r\n\r\nfunction addIceCandidateToPeer(id, iceCandidate) {\r\n\t_rtc__WEBPACK_IMPORTED_MODULE_2__[\"addIceCandidate\"](peers.get(id), iceCandidate);\r\n}\r\n\r\nfunction getPeer(id) {\r\n\treturn peers.get(id);\r\n}\r\n\r\nfunction disconnect() {\r\n\t//TODO\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./Src/Main.js?");

/***/ }),

/***/ "./Src/Signalling/RTCdataChannelSignalling.js":
/*!****************************************************!*\
  !*** ./Src/Signalling/RTCdataChannelSignalling.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return dataTransfer; });\n/* harmony import */ var _transceiver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../transceiver */ \"./Src/transceiver.js\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ \"./Src/logger.js\");\n\r\n\r\n\r\nfunction dataTransfer(peer) {\r\n\tconst dataChannel = peer.dataChannel;\r\n\tdataChannel.addEventListener('open', event => {\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Data Channel opened with: \" + id, log.debug);\r\n\t\tpeer.signallingMethod = signallingMethod.dataChannel;\r\n\t});\r\n\t\r\n\tdataChannel.addEventListener('close', event => {\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Data Channel closed with: \" + id, log.debug);\r\n\t});\r\n\r\n\tdataChannel.addEventListener('message', event => {\r\n\t\tvar message = JSON.parse(evt.data);\r\n\t\tObject(_transceiver__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(message);\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Received\" + message, log.debug);\r\n\r\n\t});\r\n\r\n}\n\n//# sourceURL=webpack:///./Src/Signalling/RTCdataChannelSignalling.js?");

/***/ }),

/***/ "./Src/Signalling/Signalling.js":
/*!**************************************!*\
  !*** ./Src/Signalling/Signalling.js ***!
  \**************************************/
/*! exports provided: initSignalling, sendTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initSignalling\", function() { return initSignalling; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sendTo\", function() { return sendTo; });\n/* harmony import */ var _socketSignalling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./socketSignalling */ \"./Src/Signalling/socketSignalling.js\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ \"./Src/logger.js\");\n/* harmony import */ var _Main__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Main */ \"./Src/Main.js\");\n\r\n\r\n\r\n\r\n\r\nfunction initSignalling() {\r\n\tObject(_socketSignalling__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_Main__WEBPACK_IMPORTED_MODULE_2__[\"wsUri\"]);\r\n}\r\nfunction sendTo(type, data, receiver) {\r\n\tconst message = {\r\n\t\ttype: type,\r\n\t\tsender: _Main__WEBPACK_IMPORTED_MODULE_2__[\"myUser\"].id,\r\n\t\treceiver: receiver,\r\n\t\tdata: data\r\n\t}\r\n\tif(receiver == -1) {\r\n\t\tsendViaWebsockets(message);\r\n\t}\r\n\telse {\r\n\t\tconst signallingMethod = _Main__WEBPACK_IMPORTED_MODULE_2__[\"getPeer\"](receiver).signallingMethod;\r\n\t\tswitch(signallingMethod) {\r\n\t\t\tcase 1:\r\n\t\t\t\tsendViaWebsockets(message);\r\n\t\t\t\tbreak;\r\n\t\t\tcase 2:\r\n\t\t\t\tsendViaDataChannel(message);\r\n\t\t\t\tbreak;\r\n\t\t\tcase 3:\r\n\t\t\t\t//TODO: Route data through peers\r\n\t\t\t\tbreak;\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction sendViaWebsockets(message) {\r\n\r\n\ttry {\r\n\t\twebsocket.send(JSON.stringify(message));\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Sending \" + message.type + \" to \" + message.receiver, log.log);\r\n\t} catch (error) {\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Failed to communicate with server with Error\" + error, log.error);\r\n\t}\r\n\r\n}\r\n\r\nfunction sendViaDataChannel(message) {\r\n\ttry {\r\n\t\t_Main__WEBPACK_IMPORTED_MODULE_2__[\"getPeer\"](message.receiver).dataChannel.send(JSON.stringify(message));\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Sending \" + message.type + \" to \" + message.receiver, log.log);\r\n\t} catch (error) {\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Failed to communicate with \" + message.receiver + \" via dataChannel with Error\" + error, log.error);\r\n\t}\r\n}\n\n//# sourceURL=webpack:///./Src/Signalling/Signalling.js?");

/***/ }),

/***/ "./Src/Signalling/socketSignalling.js":
/*!********************************************!*\
  !*** ./Src/Signalling/socketSignalling.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return startWebSocket; });\n/* harmony import */ var _transceiver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../transceiver */ \"./Src/transceiver.js\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ \"./Src/logger.js\");\n\r\n\r\n\r\nfunction startWebSocket(wsUri) {\r\n\twebsocket = new WebSocket(wsUri);\r\n\twebsocket.onopen = function (evt) { onOpen(evt) };\r\n\twebsocket.onclose = function (evt) { onClose(evt) };\r\n\twebsocket.onmessage = function (evt) { onMessage(evt) };\r\n\twebsocket.onerror = function (evt) { onError(evt) };\r\n}\r\n\r\nfunction onOpen(evt) {\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Signalling Connected\",log.info);\r\n\tstartButton.disabled = false;\r\n\tstopButton.disabled = false;\r\n}\r\n\r\nfunction onClose(evt) {\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Signalling Disconnected\",log.info);\r\n\tstartWebSocket();\r\n}\r\n\r\nfunction onMessage(evt) {\r\n\tvar message = JSON.parse(evt.data);\r\n\tObject(_transceiver__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(message);\r\n}\r\n\r\nfunction onError(evt) {\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Signalling Error: \" + evt, log.error);\r\n}\n\n//# sourceURL=webpack:///./Src/Signalling/socketSignalling.js?");

/***/ }),

/***/ "./Src/logger.js":
/*!***********************!*\
  !*** ./Src/logger.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return logger; });\n//Logging types and conventions\r\nconst log = {\r\n\terror:1,\r\n\twarn:2,\r\n\tlog:3,\r\n\tinfo:4,\r\n\tdebug:5\r\n}\r\nObject.freeze(log);\r\n\r\nfunction logger(message, type) {\r\n\tswitch(type) {\r\n\r\n\t\t//Error\r\n\t\tcase 1:\r\n\t\t\tconsole.error(message);\r\n\t\t\tbreak;\r\n\r\n\t\t//Warn\t\r\n\t\tcase 2:\r\n\t\t\tconsole.warn(message);\r\n\t\t\tbreak;\r\n\r\n\t\t//Log\r\n\t\tcase 3:\r\n\t\t\t//console.log(message);\r\n\t\t\tbreak;\r\n\r\n\t\t//Info\r\n\t\tcase 4:\r\n\t\t\tconsole.log(`%c ${message}`,\"color:Chartreuse\");\r\n\t\t\tbreak;\r\n\r\n\t\t//Debug\r\n\t\tcase 5:\r\n\t\t\tconsole.log(`%c ${message}`,\"color:yellow\");\r\n\t\t\tbreak;\r\n\r\n\t\tdefault:\r\n\t\t\tconsole.log(message);\r\n\t\t\tbreak;\r\n\t}\r\n\r\n}\n\n//# sourceURL=webpack:///./Src/logger.js?");

/***/ }),

/***/ "./Src/rtc.js":
/*!********************!*\
  !*** ./Src/rtc.js ***!
  \********************/
/*! exports provided: createOffer, createAnswer, acceptAnswer, addIceCandidate, manageConnection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createOffer\", function() { return createOffer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createAnswer\", function() { return createAnswer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"acceptAnswer\", function() { return acceptAnswer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addIceCandidate\", function() { return addIceCandidate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"manageConnection\", function() { return manageConnection; });\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ \"./Src/logger.js\");\n\r\n\r\nconst offerOptions = {\r\n\tofferToReceiveVideo: 1,\r\n};\r\n\r\nfunction createOffer(peer) {\r\n\tconst peerConnection = peer.peerConnection;\r\n    peerConnection.createOffer(offerOptions)\r\n\t\t.then((offer) => {\r\n\t\t\tpeerConnection.setLocalDescription(offer).then(() => {\r\n\t\t\t}).catch(error => {\r\n\t\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"Peer connection local description error \" + error, log.error);\r\n\t\t\t});\r\n\t\t\tsendTo('sessionDescriptionOffer', offer, id);\r\n\t\t});\r\n}\r\n\r\nfunction createAnswer(peer, offer) {\r\n\tconst peerConnection = peer.peerConnection;\r\n    peerConnection.setRemoteDescription(offer);\r\n\tpeerConnection.createAnswer()\r\n\t\t.then((answer) => {\r\n\t\t\tpeerConnection.setLocalDescription(answer).then(() => {\r\n\t\t\t}).catch(error => {\r\n\t\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"Peer connection local description error \" + error, log.error);\r\n\t\t\t});\r\n\t\t\tsendTo('sessionDescriptionAnswer', answer, id);\r\n\t\t});\r\n}\r\n\r\nfunction acceptAnswer(peer, answer) {\r\n\tpeer.peerConnection.setRemoteDescription(answer);\r\n}\r\n\r\nfunction addIceCandidate(peer,iceCandidate) {\r\n\tpeer.peerConnection.addIceCandidate(iceCandidate)\r\n\t\t.then(() => {\r\n\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"ICE candidate added\", log.log);\r\n\t\t}).catch(error => {\r\n\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"Ice candidate error \" + error, log.error);\r\n\t\t});\r\n}\r\n\r\nfunction manageConnection(peer) {\r\n\r\n\tconst peerConnection = peer.peerConnection;\r\n\r\n\t//Ice Candidate\r\n\t//sending iceCandidate data\r\n\tpeerConnection.onicecandidate = event => {\r\n\t\tif (event.candidate) {\r\n\t\t\tsendTo('iceCandidate', event.candidate, id);\r\n\t\t}\r\n\t};\r\n\r\n\tpeerConnection.addEventListener(\"negotiationneeded\", ev => {\r\n\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"Negotiation Needed\", log.debug);\r\n\t});\r\n\r\n\t//WebRTC connection status\r\n\tpeerConnection.addEventListener('connectionstatechange', event => {\r\n\t\tswitch(peerConnection.connectionState) {\r\n\t\t\tcase 'connected':\r\n\t\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"WebRTC Connected with \" + id, log.info);\r\n\t\t\t\tbreak;\r\n\t\t\tcase 'disconnected':\r\n\t\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"WebRTC Disonnected with \" + id, log.info);\r\n\t\t\t\tbreak;\r\n\t\t\tdefault:\r\n\t\t\t\tbreak;\t\t\t\r\n\t\t}\r\n\t});\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack:///./Src/rtc.js?");

/***/ }),

/***/ "./Src/transceiver.js":
/*!****************************!*\
  !*** ./Src/transceiver.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return receivedMessage; });\n/* harmony import */ var _Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Main */ \"./Src/Main.js\");\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger */ \"./Src/logger.js\");\n\r\n\r\n\r\n\r\n//To decode message received from signalling\r\nfunction receivedMessage(message) {\r\n    var from = message.sender;\r\n    var data = message.data;\r\n    var type = message.type;\r\n\r\n\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"Received \" +  type + \" from \" + from,log.log);\r\n\r\n\tswitch (type) {\r\n\t\tcase 'userData':\r\n\t\t\tObject(_logger__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"My id is \" + data,log.info);\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"myUser\"].id = data;\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'currentActive':\r\n\t\t\tdata.forEach((id) => {\r\n\t\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"activePeers\"].add(id);\r\n\t\t\t});\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'newUser':\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"activePeers\"].add(data);\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"connectTo\"](data);\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'deleteUser':\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"activePeers\"].delete(data);\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'sessionDescriptionOffer':\r\n\t\t\tvar offer = data;\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"acceptOffer\"](from, offer);\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'sessionDescriptionAnswer':\r\n\t\t\tvar answer = data;\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"acceptAnswer\"](from, answer);\r\n\t\t\tbreak;\r\n\r\n\t\tcase 'iceCandidate':\r\n\t\t\tvar iceCandidate = data;\r\n\t\t\t_Main__WEBPACK_IMPORTED_MODULE_0__[\"addIceCandidateToPeer\"](from, iceCandidate);\r\n\t\t\tbreak;\r\n\r\n\t}\r\n}\n\n//# sourceURL=webpack:///./Src/transceiver.js?");

/***/ })

/******/ });