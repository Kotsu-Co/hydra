import waWeb from "whatsapp-web.js";
const { Client, LocalAuth } = waWeb;
import { socket } from "zeromq";
import { Assert } from "ts-runtime-checks";
import {
  WClientFunctionArgs,
  WClientFunctions,
} from "../types/WClientMethods.js";
import chalk from "chalk";

const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({ clientId: "main" }),
});


async function callMethod(
  method: WClientFunctions,
  ...args: Assert<WClientFunctionArgs<typeof method>>
  ) {
    //@ts-ignore
    return await client[method].call(client, ...args);
}

const responder = socket("rep");
responder.on("message", async (request) => {
  console.log("Received request: [", request.toString(), "]");
    try {
      const res = await callMethod("getChats");
      responder.send(JSON.stringify(res));
    } catch (error) {
      console.error(error);
      responder.send(JSON.stringify({ error: error }));
    }
});

responder.bind("tcp://*:5555/responder", function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 5555...");
  }
});

const eventProducer = socket("push");


// Initialize the whatsapp client
client.initialize().then(() => {
  console.log(chalk.green("Whatsapp client initialized!"));
});