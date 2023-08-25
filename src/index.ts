import { gemWalletInit, signGemTransaction } from "./gemWallet";
import {
  walletConnectInit,
  signWalletConnectTx,
  walletConnectDisconnect,
} from "./walletconnect";
import { xummInit, signedXummTransaction, xummDisconnect } from "./xummWallet";
import { Xumm } from "xumm";
import { XrplClient } from "xrpl-client";
import type { ResolvedFlow } from "xumm-oauth2-pkce";
import SelectWalletModal from "./modal";
import React from "react";

// import {
//   IsInstalledResponse,
//   GetAddressResponse,
//   GetNetworkResponse,
// } from "@gemwallet/api";
import { SessionTypes } from "@walletconnect/types";

//networks types supported by the kt
export enum Networks {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
  DEVNET = "DEVNET",
  AMM = "AMM",
}

//wallets supported
export enum EsupportedWallet {
  XUMM = "XUMM",
  GEM = "GEMWallet",
  WALLETCONNECT = "WalletConnect",
}

//network configuration
export const EsupportedNetworks = {
  MAINNET: {
    name: "Mainnet",
    networkWss: "wss://xrplcluster.com",
    walletconnectId: "xrpl:0",
    rpc: "https://xrplcluster.com",
  },
  TESTNET: {
    name: "Testnet",
    networkWss: "wss://s.altnet.rippletest.net:51233/",
    walletconnectId: "xrpl:1",
    rpc: "https://testnet.xrpl-labs.com",
  },

  DEVNET: {
    name: "Devnet",
    networkWss: "wss://s.devnet.rippletest.net:51233/",
    walletconnectId: "xrpl:2",
    rpc: "https://s.devnet.rippletest.net:51234/",
  },
};

export class XRPLKit {
  private selectedWallet!: EsupportedWallet;
  private network!: Networks;
  private Client: any;
  private Session!: any;

  // general way to initialize wallet
  constructor(selectedWallet: EsupportedWallet, network: Networks) {
    this.addWallet(selectedWallet);
    this.addNetwork(network);
  }

  public addNetwork(network: Networks): void {
    //utility method for adding and updating network
    const supportedNetworks = Object.values(Networks);

    if (!supportedNetworks.includes(network)) {
      throw new Error(`Wallet network "${network}" is not supported`);
    }

    this.network = network;
  }
  // public getNetwork() {
  //   return Object.values(this.network);
  // }

  public addWallet(wallet: EsupportedWallet): void {
    //utility method for adding and updating wallet selected by users
    const supportedWallet = Object.values(EsupportedWallet);
    if (!supportedWallet.includes(wallet)) {
      throw new Error(`Wallet type "${wallet}" is not supported`);
    }

    this.selectedWallet = wallet;
  }

  public async connectKitToWallet(
    projectId?: string,
    apiKey?: string,
  ): Promise<
    | {
        xummClient: Xumm;
        activeSession: Error | ResolvedFlow | undefined;
      }
    | {
        gemClient: XrplClient;
        activeSession: any;
      }
    | {
        client: any;
        activeSession: SessionTypes.Struct;
      }
  > {
    let useWallet = this.selectedWallet;
    const selectedNetwork =
      EsupportedNetworks[
        this.network as unknown as keyof typeof EsupportedNetworks
      ];

    switch (useWallet) {
      case EsupportedWallet.XUMM:
        // Handle xumm connect here
        const xummResponse = await xummInit(apiKey!);
        this.Session = xummResponse.activeSession;
        this.Client = xummResponse.xummClient;
        return xummResponse;

      case EsupportedWallet.GEM:
        // Handle gem connect here
        const gemResponse = await gemWalletInit(selectedNetwork.networkWss);
        this.Client = gemResponse.gemClient;
        return gemResponse;

      case EsupportedWallet.WALLETCONNECT:
        // WalletConnect login here
        const wcSession = await walletConnectInit(projectId!, selectedNetwork);
        this.Session = wcSession?.activeSession;
        this.Client = wcSession?.client;
        return wcSession!;

      default:
        throw new Error("The selected wallet type is not supported");
    }
  }

  public async signTransaction(transaction: any) {
    //method for handling signing transaction
    let walletType = this.selectedWallet;
    switch (walletType) {
      case EsupportedWallet.WALLETCONNECT:
        let topic = this.Session.topic;
        let formateTx = { ...transaction, topic };
        return await signWalletConnectTx(formateTx, this.Client);

      case EsupportedWallet.XUMM:
        const signedTransaction = await signedXummTransaction(
          this.Client,
          transaction,
        );
        return signedTransaction;

      case EsupportedWallet.GEM:
        //transaction can be any valid tx
        return await signGemTransaction(transaction);

      default:
        throw new Error("the wallet type you selected is not supported ");
    }
  }

  //static function that open the list of wallets
  public async disconnect(): Promise<void> {
    switch (this.selectedWallet) {
      case EsupportedWallet.WALLETCONNECT:
        return await walletConnectDisconnect(this.Client);
      case EsupportedWallet.XUMM:
        return await xummDisconnect(this.Client);
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
    return this.selectedWallet;
  }

  public getNetwork() {
    return EsupportedNetworks[
      this.network as unknown as keyof typeof EsupportedNetworks
    ];
  }

  public openModal() {
    console.log("got inside of the modal ");
    return React.createElement("SelectWalletModal", {
      isOpen: true,
    });
  }
}

//TODOs
// refactor for switch cases - use dynamic import
// formatting transaction
