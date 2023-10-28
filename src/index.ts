export * from "./types/constants";
export * from "./types/enums";

import { gemWalletInit, signGemTransaction } from "./gemWallet";
import {
  walletConnectInit,
  signWalletConnectTx,
  walletConnectDisconnect,
} from "./walletconnect";
import { xummInit, signedXummTransaction, xummDisconnect } from "./xummWallet";
import { Xumm } from "xumm";
import type { ResolvedFlow } from "xumm-oauth2-pkce";

import {
  IsInstalledResponse,
  GetAddressResponse,
  GetNetworkResponse,
} from "@gemwallet/api";
import { SessionTypes } from "@walletconnect/types";
import { XrplInstance, formatTxResponse } from "./utils";

import { EsupportedWallet } from "./types/enums";
import { Networks } from "./types/enums";
import { EsupportedNetworks } from "./types/constants";

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

  public addWallet(wallet: EsupportedWallet): void {
    //utility method for adding and updating wallet selected by users
    const supportedWallet = Object.values(EsupportedWallet);
    if (!supportedWallet.includes(wallet)) {
      throw new Error(`Wallet type "${wallet}" is not supported`);
    }

    this.selectedWallet = wallet;
  }

  public async connectKitToWallet(
    //method for connecting to wallets
    projectId?: string,
    apiKey?: string,
  ): Promise<
    | {
        xummClient: Xumm;
        activeSession: Error | ResolvedFlow | undefined;
      }
    | {
        isInstalled: () => Promise<IsInstalledResponse>;
        publicKey: GetAddressResponse;
        currentNetwork: GetNetworkResponse;
      }
    | {
        client: any;
        activeSession: SessionTypes.Struct;
      }
  > {
    // connectKitToWallet is how you initially connect to a specific wallet
    // project id can be any number or string, make sure it valid when connecting to wallet connect
    // projectId is only for walletconnect
    // this is where we should set the network
    let useWallet = this.selectedWallet;
    const selectedNetwork =
      EsupportedNetworks[
        this.network as unknown as keyof typeof EsupportedNetworks
      ];

    switch (useWallet) {
      case EsupportedWallet.XUMM:
        //handle xumm connect here
        let response = await xummInit(apiKey!);
        this.Session = response.activeSession;
        this.Client = response.xummClient;
        return response;
      case EsupportedWallet.GEM:
        //handle gem connect here
        let gemClient = XrplInstance(selectedNetwork.networkWss);
        this.Client = gemClient;
        let GClient = await gemWalletInit();
        return GClient;
      case EsupportedWallet.WALLETCONNECT:
        //walletconnect login here

        let session = await walletConnectInit(projectId!, selectedNetwork);
        this.Session = session?.activeSession;
        this.Client = session?.client;
        return session!;
      default:
        throw new Error("the wallet type you selected is not supported ");
    }
  }
  public async signTransaction(transaction: any): Promise<{
    hash: string | any;
  }> {
    //method for handling signing transaction
    let walletType = this.selectedWallet;
    switch (walletType) {
      case EsupportedWallet.WALLETCONNECT:
        let topic = this.Session.topic;
        let formateTx = { ...transaction, topic };
        let wcSigned = await signWalletConnectTx(formateTx, this.Client);
        let wcResp = await formatTxResponse(wcSigned, this.selectedWallet);
        return wcResp;

      case EsupportedWallet.XUMM:
        const signedTransaction = await signedXummTransaction(
          this.Client,
          transaction,
        );
        let resp = await formatTxResponse(
          signedTransaction,
          this.selectedWallet,
        );
        return resp;

      case EsupportedWallet.GEM:
        //transaction can be any valid tx
        let gemSignedTx = await signGemTransaction(transaction);

        let gemResp = await formatTxResponse(gemSignedTx, this.selectedWallet);
        return gemResp;

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
}

//TODOs
// refactor for switch cases - use dynamic import
// formatting transaction
