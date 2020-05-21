var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");

message.addEventListener("keyup", function(event) {

   if (event.keyCode === 13) {
     // Cancel the default action, if needed
     event.preventDefault();
     // Trigger the button element with a click
     send.click();
   }
 });

window.addEventListener("load", onLoad);

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
    var message = evt.data;
    output.innerHTML += "<p><b>Stranger: </b>" + message + "</p>";
 }
      
 function onError(evt) {
    console.log("Error: ", evt);
 }


