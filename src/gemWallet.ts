import {
  isInstalled,
  getAddress,
  getNetwork,
  // sendPayment,
  IsInstalledResponse,
  GetAddressResponse,
  GetNetworkResponse,
  submitTransaction,
} from "@gemwallet/api";

import * as XRPL from "xrpl";

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

export async function signGemTransaction(transaction: XRPL.Transaction) {
  let signedTx = await submitTransaction({
    transaction: transaction,
  });
  return signedTx;
}
