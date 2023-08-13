
import zmq from 'zeromq';

// socket to talk to server
console.log("Connecting to hello world server...");
var requester = zmq.socket('req');

requester.on("message", function(reply) {
  console.log("Received reply", ": [", JSON.parse(reply.toString()), ']');
});

requester.connect("tcp://localhost:5555");

requester.send(JSON.stringify({method: "getChats"}))