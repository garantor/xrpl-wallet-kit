import { Xumm } from "xumm";
import type { ResolvedFlow } from "xumm-oauth2-pkce";

export async function xummInit(apiKey: string): Promise<{
  xummClient: Xumm;
  activeSession: ResolvedFlow | Error | undefined;
}> {
  let xummClient = new Xumm(apiKey);

  let activeSession = await xummClient.authorize();
  return { xummClient, activeSession };
}

export async function signedXummTransaction(
  xummInstance: Xumm,
  transaction: any
): Promise<any | undefined> {
  let signTx = await xummInstance.payload?.createAndSubscribe(transaction);
  openPopWindow(signTx!.created.next.always, 500, 500);
  let wssUrl = signTx?.websocket.url;
  let resp = await openWssConnection(wssUrl!);
  return resp;

  // return signTx;
}
async function openWssConnection(url: string): Promise<any> {
  return new Promise((resolve, reject) => {

    let wssConnection = new WebSocket(url);

    wssConnection.onmessage = (event) => {
      const eventData = JSON.parse(event.data); // Parse the JSON data

      if (eventData.signed === true) {
        resolve(eventData); // Resolve the promise with the received data
      } else if (eventData.signed === false) {
        // Handle the case where eventData.signed is false
        reject(new Error("Transaction signing failed")); // Reject the promise with an error message
      }
    };

    wssConnection.onerror = (error) => {
      reject(error); // Reject the promise in case of an error
    };
  });
}

export async function xummDisconnect(xummInstance: Xumm): Promise<void> {
  return await xummInstance.logout();
}

export function openPopWindow(url: string, height: number, width: number) {
  // Remove the `http://localhost:3000/` part of the URL.
  const absoluteUrl = new URL(url, window.location.href).toString();
  window.open(absoluteUrl, "Sign Xumm", "height=" + height + ",width=" + width);
}
