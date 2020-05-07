var socket = io.connect("http://192.168.137.1:8081/",{secure : true});

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");
  

send.addEventListener("click", ()=>{
    socket.emit("msg",message.value);
    message.value = "";
});

socket.on("msg", (data) => {
    output.innerHTML += "<p>" + data + "</p>";
});



