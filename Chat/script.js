//var socket = io.connect("http://localhost:8081/",{secure : true});

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");

window.addEventListener("load", onLoad);

var websocket;

function onLoad() {
    var wsUri = "ws://127.0.0.1:8081";
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
    console.log("Connected");
    send.addEventListener("click", ()=>{
        websocket.send(message.value);
        output.innerHTML += "<p><b>Me: </b>" + message.value + "</p>";
        message.value = "";
    });
 }
      
 function onClose(evt) {
    console.log("Disconnected");
 }
      
 function onMessage(evt) {
    // There are two types of messages:
    // 1. a chat participant message itself
    // 2. a message with a number of connected chat participants
    var message = evt.data;
    output.innerHTML += "<p><b>Stranger: </b>" + message + "</p>";
 }
      
 function onError(evt) {
    console.log("Error: ", evt);
 }


