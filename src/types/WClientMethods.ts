import { Client } from "whatsapp-web.js";
export type WClientMethods = keyof InstanceType<typeof Client>;
// extract only the function names from the Client class as an array of the function names
export type WClientFunctions = {
  [K in WClientMethods]: InstanceType<typeof Client>[K] extends Function
    ? K
    : never;
}[WClientMethods];
// get the function names as a union of the function names
export type WClientFunctionArgs<T extends WClientFunctions> = Parameters<
  InstanceType<typeof Client>[T]
>;
// get

//
//
