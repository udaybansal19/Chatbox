var socket = io.connect("http://192.168.137.1:8081/",{secure : true});

var output = document.getElementById("output");
var message = document.getElementById("message");
var send = document.getElementById("send");
var constraints = { video : true , audio : true };

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    socket.emit("peerID",peer.id); 
  });
  

// send.addEventListener("click", ()=>{
//     socket.emit("msg",message.value);
//     message.value = "";
// });

// socket.on("msg", (data) => {
//     output.innerHTML += "<p>" + data + "</p>";
// });

var f = 1;

var mediaStream;

function successCallback(stream){
  var video = document.getElementById("webcam");
  video.srcObject = stream;
  mediaStream = stream;
}

function errorCallback(error) {
  console.log("navigator.getUserMedia: ",error);
}    
//var getUserMedia = navigator.getUserMedia(constraints,successCallback,errorCallback) || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var mediaStream = navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  /* use the stream */
  var video = document.getElementById("webcam");
  video.srcObject = stream;
  mediaStream = stream;
})
.catch(function(err) {
  /* handle the error */
  console.log("Error in getUserMedia");
});
socket.on("peerID",(data) => {
    if(data != peer.id && data != null){
        console.log("Peer Found: " + data);
      var conn = peer.connect(data);
      //sender
      f=0;
      console.log("sender");
      messaging(conn);

     // getUserMedia({video: true, audio: true}, function(stream) {
        var call = peer.call(data, mediaStream);
        videoCalling(call);
  //});
 }
  if(f){
    //receiver
    peer.on('connection', function(conn) {
        console.log("receiver");
        messaging(conn);
      });

      peer.on('call', function(call) {
        // Answer the call, providing our mediaStream
        //getUserMedia({video: true, audio: true}, function(stream) {
          call.answer(mediaStream); // Answer the call with an A/V stream.
        videoCalling(call);

        //});
      });
  }
});


function messaging(conn){

    conn.on('open',() =>{

      send.addEventListener("click", ()=>{
          conn.send(message.value);
          output.innerHTML += "<p>" + message.value + "</p>";
          message.value = "";
      });

      conn.on('data', function(data) {
          output.innerHTML += "<p>" + data + "</p>";
      });

    });

}

function videoCalling(call) {
  console.log("flag");
  console.log(call);
  call.on('stream', function(remoteStream) {
    // Show stream in some video/canvas element.
    var callVideo = document.getElementById("peer-webcam");
     callVideo.srcObject = remoteStream;
  });
  // call.on('stream', function(stream) {
  //   // `stream` is the MediaStream of the remote peer.
  //   // Here you'd add it to an HTML video/canvas element.
  //   var callVideo = document.getElementById("peer-webcam");
  //    callVideo.srcObject = stream;
  // });
}

var firebaseConfig = {
  apiKey: "AIzaSyCeUDv1aYk2SbhHhM_C7AZvLjrsI6H_XHU",
  authDomain: "chatbox-3bafb.firebaseapp.com",
  databaseURL: "https://chatbox-3bafb.firebaseio.com",
  projectId: "chatbox-3bafb",
  storageBucket: "chatbox-3bafb.appspot.com",
  messagingSenderId: "426689793721",
  appId: "1:426689793721:web:ed37cb7f2d52c92c741568",
  measurementId: "G-WLJM0X1KM9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let firebaseConn = firebase.database().ref('ConnectionId');

function formSubmit(e) {
	e.preventDefault();
	// Get Values from the DOM
	let fname = document.querySelector('#fname').value;
	let lname = document.querySelector('#lname').value;
	let email = document.querySelector('#email').value;
	let subject = document.querySelector('#subject').value;
	let message = document.querySelector('#message').value;

	document
	.getElementById('registrationform')
	.reset();

	document.querySelector('#alert-bo').style.visibility = "visible";
  
	//send message values
	sendMessage(fname, lname, email, subject, message);
  
  }
  
  //Send Message to Firebase(4)
  
  function sendMessage(fname, lname, email, subject, message) {
	let newFormMessage = firebaseConn.push();
	newFormMessage.set({
	  fname: fname,
	  lname: lname,
	  email: email,
	  subject: subject,
	  message: message,
	  });
  }
  
