

import { gemWalletInit } from "./gemWallet";
import { walletConnectInit, signWalletConnectTx, walletConnectDisconnect } from "./walletconnect";
import { xummInit, signedXummTransaction, xummDisconnect } from './xumm'
import * as XRPL from "xrpl";

export enum Networks {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
  DEVNET = "DEVNET",
  AMM = "AMM"
}


export enum EsupportedWallet {
  XUMM = "XUMM",
  GEM = "GEMWallet",
  WALLETCONNECT = "WalletConnect"
}

export const EsupportedNetworks = {
  MAINNET: {
    name: "Mainnet",
    networkWss: "wss://xrplcluster.com",
    walletconnectId: 'xrpl:0',
    rpc: "https://xrplcluster.com"
  },
  TESTNET: {
    name: "Testnet",
    networkWss: "wss://s.altnet.rippletest.net:51233/",
    walletconnectId: 'xrpl:1',
    rpc: "https://testnet.xrpl-labs.com"
  },

  DEVNET: {
    name: "Devnet",
    networkWss: "wss://s.devnet.rippletest.net:51233/",
    walletconnectId: 'xrpl:2',
    rpc: "https://s.devnet.rippletest.net:51234/"

  }
}

export class XRPLKit {
  private selectedWallet!: EsupportedWallet;
  private network!: Networks;
  private Client: any
  private Session!: any;

  // general way to initialize wallet
  constructor(
    selectedWallet: EsupportedWallet,
    network: Networks,
  ) {
    this.addWallet(selectedWallet);
    this.addNetwork(network);
  }

  public addNetwork(network: Networks): void {
    const supportedNetworks = Object.values(Networks);

    if (!supportedNetworks.includes(network)) {
      throw new Error(`Wallet network "${network}" is not supported`);
    }

    this.network = network;
  }
  public getNetwork(){
    return Object.values(this.network);

  }

  public addWallet(wallet: EsupportedWallet): void {
    const supportedWallet = Object.values(EsupportedWallet);
    if (!supportedWallet.includes(wallet)) {
      throw new Error(`Wallet type "${wallet}" is not supported`);
    }

    this.selectedWallet = wallet;
  }

  public async connectKitToWallet(projectId?: string, apiKey?: string) {
    // connectKitToWallet is how you initially connect to a specific wallet
    // project id can be any number or string, make sure it valid when connecting to wallet connect
    // projectId is only for walletconnect
    // this is where we should set the network
    let useWallet = this.selectedWallet
    const selectedNetwork = EsupportedNetworks[this.network as unknown as keyof typeof EsupportedNetworks]


    switch (useWallet) {
      case EsupportedWallet.XUMM:
        //handle xumm connect here
        let response = await xummInit(apiKey!)
        this.Session = response.activeSession
        this.Client = response.xummClient
        return response
      case EsupportedWallet.GEM:
        //handle gem connect here
        let gemClient = new XRPL.Client(selectedNetwork.networkWss)
        this.Client = await gemClient.connect()
        return ;

        return await gemWalletInit()
      case EsupportedWallet.WALLETCONNECT:
        //walletconnect login here
        console.log('inside wallet connect ')
        let session = await walletConnectInit(projectId!, selectedNetwork)
        this.Session = session?.activeSession
        this.Client = session?.client
        return session
      default:
        throw new Error("the wallet type you selected is not supported ")

    }
  }
  public async signTransaction(transaction: any) {
    let walletType = this.selectedWallet
    switch (walletType) {
      case EsupportedWallet.WALLETCONNECT:
      let topic = this.Session.topic
        let formateTx = {...transaction, topic}
        return await signWalletConnectTx(formateTx, this.Client)
      
      case EsupportedWallet.XUMM:
        return await signedXummTransaction(this.Client, transaction)

        case EsupportedWallet.GEM:
          return;
          //transaction can be any valid tx
          // return await signGemTransaction(transaction, this.Client)

      

      default:
        throw new Error("the wallet type you selected is not supported ")
    }
  }


  //static function that open the list of wallets
  public async disconnect() {
    switch (this.selectedWallet) {
      case EsupportedWallet.WALLETCONNECT:
        return await walletConnectDisconnect(this.Client)
      case EsupportedWallet.XUMM:
        return await xummDisconnect(this.Client)
      case EsupportedWallet.GEM:
        //Gem wallet does not provide an api for logout
        return;

        break;

      default:
        break;
    }
    // this open the modal with the list of wallets supported by the kit


  }

  public async getSelectedWallet() {
    return this.selectedWallet
  }


}

