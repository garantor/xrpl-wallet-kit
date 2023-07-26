import {
  isInstalled,
  getAddress,
  getNetwork,
  sendPayment,
  IsInstalledResponse,
  GetAddressResponse,
  GetNetworkResponse,
} from "@gemwallet/api";

import { XrplClient } from "xrpl-client";

export interface WalletInitResponse {
  isInstalled: boolean;
  publicKey?: string;
  currentNetwork?: any;
}

export async function gemWalletInit(): Promise<{
  isInstalled: () => Promise<IsInstalledResponse>;
  publicKey: GetAddressResponse;
  currentNetwork: GetNetworkResponse;
}> {
  let checkInstall = await isInstalled();
  if (checkInstall) {
    let address = await getAddress();
    let network = await getNetwork();

    let response = {
      isInstalled: isInstalled,
      publicKey: address,
      currentNetwork: network, //this is the current network the wallet is connected to
    };
    return response;
  }

  throw new Error("Gem Wallet not install");
}

export async function signGemTransaction(transaction: any, client: XrplClient) {
  let signedTx = await sendPayment(transaction);

  console.log(signedTx);
  //   let submittx = await client.send({ command: "submit", tx_blob: signedTx });
  //   client.close();
  //   console.log(submittx);
  return signedTx;
}
