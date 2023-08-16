import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import zmq from 'zeromq';

const webServer = fastify();
webServer.register(fastifyIO);
const requests = [];

webServer.get("/ws/", (req, reply) => {
  webServer.io.emit("hello");
});

webServer.get("/", (req, reply) => {
  reply.send("Hello world!");
})

webServer.get("/chats", async (req, reply) => {
  return await new Promise((resolve, reject) => {
    requester.send(JSON.stringify({method: "getChats"}));
    requests.push({resolve, reject});
  })
})
webServer.ready().then(() => {
  // we need to wait for the server to be ready, else `server.io` is undefined
  webServer.io.on("connection", (socket) => {
    // ...
  });
});

webServer.listen({ port: 3000}).then(() => {
  console.log("Web server listening on port 3000...");
});


// socket to talk to server
const requester = zmq.socket('req');

requester.on("message", function(reply) {
  console.log("Received reply", ": [", JSON.parse(reply.toString()), ']');
  const {resolve, reject} = requests.shift();
  resolve(JSON.parse(reply.toString()));
});
requester.connect("tcp://localhost:5555");

const eventSubscriber = zmq.socket('sub');
eventSubscriber.on("message", function(topic, message) {
  console.log("Received event", topic.toString(), " : [", JSON.parse(message.toString()), ']');
})
eventSubscriber.connect("tcp://localhost:5556");