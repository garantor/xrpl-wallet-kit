import * as XRPL from "xrpl";
import { EsupportedWallet } from "./types/enums";

export async function XrplInstance(serverUri?: string) {
  const client = new XRPL.Client(
    serverUri || "wss://s.altnet.rippletest.net:51233",
  );
  await client.connect();
  return client;
}

export async function formatTxResponse(
  params: any,
  wallet: EsupportedWallet,
): Promise<{ hash: string } | any> {
  // Return only the transaction hash
  switch (wallet) {
    case EsupportedWallet.XUMM:
      // Format xumm tx
      return {
        hash: params.txid,
      };

    case EsupportedWallet.GEM:
      // Format gem tx
      return {
        hash: params.result.hash,
      };

    case EsupportedWallet.WALLETCONNECT:
      // Format walletconnect tx
      return {
        hash: params.result.tx_json.transaction.result.hash,
      };

    default:
      break;
  }
}
