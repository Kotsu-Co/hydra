import {WClientFunctionArgs, WClientFunctions} from "../../types/WClientMethods.js";
import WAWebJS from "whatsapp-web.js";

export async function callMethod(
  client: WAWebJS.Client,
  method: WClientFunctions,
  ...args: Assert<WClientFunctionArgs<typeof method>>
) {
  //@ts-ignore
  return await client[method].call(client, ...args);
}

