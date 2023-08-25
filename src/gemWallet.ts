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
import { XrplClient } from "xrpl-client";

export interface WalletInitResponse {
  isInstalled: boolean;
  publicKey?: string;
  currentNetwork?: any;
}

export async function gemWalletInit(selectedNetwork: any): Promise<{
  gemClient: XrplClient;
  activeSession: {
    isInstalled: () => Promise<IsInstalledResponse>;
    publicKey: GetAddressResponse;
    currentNetwork: GetNetworkResponse;
  };
}> {
  const gemClient = new XrplClient(selectedNetwork.networkWss);
  const checkInstall = await isInstalled();

  if (checkInstall) {
    const address = await getAddress();
    const network = await getNetwork();

    const activeSession = {
      isInstalled: isInstalled,
      publicKey: address,
      currentNetwork: network,
    };

    return { gemClient, activeSession };
  }

  throw new Error("Gem Wallet is not installed");
}

export async function signGemTransaction(transaction: XRPL.Transaction) {
  let signedTx = await submitTransaction({
    transaction: transaction,
  });
  return signedTx;
}

// isInstalled: () => Promise<IsInstalledResponse>;
// publicKey: GetAddressResponse;
// currentNetwork: GetNetworkResponse;
