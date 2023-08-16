import waWeb from "whatsapp-web.js";

const {Client, LocalAuth} = waWeb;
import {socket} from "zeromq";
import chalk from "chalk";
import * as process from "process";
import {callMethod} from "./util/callMethod.js";
import {patchEmitter} from "./util/patchEmitter.js";

const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({clientId: "main"}),
});


const responder = socket("rep");
responder.on("message", async (request) => {
  const {method, args} = JSON.parse(request.toString());
  try {
    const res = await callMethod(client, method);
    responder.send(JSON.stringify(res));
  } catch (error) {
    console.error(chalk.red("Error calling method: "), method, error);
    responder.send(JSON.stringify({error: error}));
  }
});

responder.bind("tcp://*:5555", function (err) {
  if (err) {
    console.log("Error binding responder", err);
    process.exit(0)
  } else {
    console.log(chalk.blue("Responder listening on port 5555..."));
  }
});

const eventProducer = socket("pub");
eventProducer.bind("tcp://*:5556", function (err) {
  if (err) {
    console.log("Error binding event producer", err);
    process.exit(0)
  } else {
    console.log(chalk.blue("Event producer listening on port 5556..."));
  }
});
client.on("ready", () => {
  console.log(chalk.green("Whatsapp client is ready!"));
  patchEmitter(client, (event, ...args) => {
    console.log(chalk.blue("Event emitted: "), event, args )
    eventProducer.send([event, JSON.stringify({args: args})]);
  })
  console.log(chalk.blue("Event emitter patched!"))
})


// Initialize the whatsapp client
await client.initialize()

