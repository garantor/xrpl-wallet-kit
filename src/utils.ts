import * as XRPL from "xrpl";

export async function XrplInstance(serverUri?: string) {
  const client = new XRPL.Client(
    serverUri || "wss://s.altnet.rippletest.net:51233",
  );
  await client.connect();
  return client;
}
