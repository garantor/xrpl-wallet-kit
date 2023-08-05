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
  return signTx;
}

export async function xummDisconnect(xummInstance: Xumm): Promise<void> {
  return await xummInstance.logout();
}
