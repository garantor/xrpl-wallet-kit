import { Xumm } from "xumm";
import type { ResolvedFlow } from "xumm-oauth2-pkce";

export async function xummInit(apiKey: string): Promise<{
  xummClient: Xumm;
  activeSession: ResolvedFlow | Error | undefined;
}> {
  console.log("this is the key ", apiKey);
  let xummClient = new Xumm(apiKey);
  console.log("this is inside the xumm init ", xummClient);

  let activeSession = await xummClient.authorize();
  console.log(activeSession);
  return { xummClient, activeSession };
}

export async function signedXummTransaction(
  xummInstance: Xumm,
  transaction: any,
): Promise<any | undefined> {
  let signTx = await xummInstance.payload?.createAndSubscribe(transaction);
  openPopWindow(signTx!.created.next.always, 500, 500);

  return signTx;
}

export async function xummDisconnect(xummInstance: Xumm): Promise<void> {
  return await xummInstance.logout();
}

export function openPopWindow(url: string, height: number, width: number) {
  console.log("thius is is it kit url opener ", url);
  // Remove the `http://localhost:3000/` part of the URL.
  const absoluteUrl = new URL(url, window.location.href).toString();
  const newWindow = window.open(
    absoluteUrl,
    "Sign Xumm",
    "height=" + height + ",width=" + width,
  );

  newWindow!.addEventListener("message", (event) => {
    console.log(event.data);
  });
}
