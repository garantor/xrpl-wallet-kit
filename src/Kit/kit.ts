import { SignClient } from "@walletconnect/sign-client/dist/types/client";
import { createWalletConnectClient, signWalletConnectTx } from "./WalletConnect/walletconnect";
import * as XRPL from 'xrpl'
import { SignClientTypes } from "@walletconnect/types";
import { Networks, EsupportedNewtworks, EwalletConnectSupportedMethod } from "../utils/inteface";


export enum EsupportedWallet {
  XUMM = "XUMM",
  GEM = "GEMWallet",
  WALLETCONNECT = "WalletConnect"
}

type SupportedNetworksType = typeof EsupportedNewtworks[keyof typeof EsupportedNewtworks];


export class XRPLKit {
  private selectedWallet!: EsupportedWallet;
  private network!: Networks;
  private Client: any

  // general way to initialize wallet
  constructor(
    selectedWallet: EsupportedWallet,
    network: Networks
  ) {
    this.addWallet(selectedWallet);
    this.addNetwork(network);
  }


  //sign walletconnect tx
  private async signWalletConnectTx(transaction: XRPL.TxRequest) {
    const selectedNetwork = EsupportedNewtworks[this.network as unknown as keyof typeof EsupportedNewtworks]

    const result = {
      client: this.Client,
      topic: transaction.topic as string,
      request: transaction.request,
      chainId: selectedNetwork.walletconnectId
    }
    return await signWalletConnectTx(result)

  }


  public addNetwork(network: Networks): void {
    const supportedNetworks = Object.values(Networks);

    if (!supportedNetworks.includes(network)) {
      throw new Error(`Wallet network "${network}" is not supported`);
    }

    this.network = network;
  }


  public addWallet(wallet: EsupportedWallet): void {
    const supportedWallet = Object.values(EsupportedWallet);
    if (!supportedWallet.includes(wallet)) {
      throw new Error(`Wallet type "${wallet}" is not supported`);
    }

    this.selectedWallet = wallet;
  }


  public async connectKitToWallet(projectId: string) {
    // connectKitToWallet is how you initially connect to a specific wallet
    // project id can be any number or string, make sure it valid when connecting to wallet connect
    // projectId is only for walletconnect
    let network = this.network
    let useWallet = this.selectedWallet
    switch (useWallet) {
      case EsupportedWallet.XUMM:
        //handle xumm connect here
        ;
      case EsupportedWallet.GEM:
        //handle gem connect here
      case EsupportedWallet.WALLETCONNECT:
        //walletconnect login here
        const userSelectedNetwork = EsupportedNewtworks[network as unknown as keyof typeof EsupportedNewtworks]
        let initializeWalletConnect = await createWalletConnectClient(projectId)
        const proposalNamespace = {
          xrpl: {
            chains: [userSelectedNetwork.walletconnectId],
            methods: [EwalletConnectSupportedMethod.SINGLE_SIGN, EwalletConnectSupportedMethod.MULTI_SIG_SIGN],
            events: ["connect", "disconnect"],
          }
        }
        let initializeWCInstance = await initializeWalletConnect.connect({
          requiredNamespaces: proposalNamespace
        })
        this.Client = initializeWalletConnect
        return initializeWCInstance




      default:
        throw new Error("the wallet type you selected is not supported ")

    }
  }
  public async signTransaction(transaction: XRPL.TxRequest) {
    let walletType = this.selectedWallet
    switch (walletType) {
      case EsupportedWallet.WALLETCONNECT:
        return this.signWalletConnectTx(transaction)

      default:
        throw new Error("the wallet type you selected is not supported ")
    }

  }
} 