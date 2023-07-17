import { SignClient } from "@walletconnect/sign-client";
import { ISignClient } from '@walletconnect/types/dist/types/sign-client/client';


export interface IWallectConnectRequestParams {
  client:ISignClient,
  topic:string,
  request:any
  chainId:string

}

export const createWalletConnectClient = async (projectId:string): Promise<ISignClient> => {
    return SignClient.init({
      projectId: projectId,
    });
  };


export async function signWalletConnectTx(params:IWallectConnectRequestParams) {
    const result = await params.client.request({
      topic:params.topic,
      request:params.request,
      chainId: params.chainId
    })  
    return result
      
  }
  async function walletConnectInit(projectId:string) {
    //users are to subscribe and listen for event 
    try {
      const client = await SignClient.init({
        projectId: projectId,
      });
      return client

    } catch (e) {
      console.log(e);
    }
  }
  

  // async function () {
  //   // let signClient = walletConnectInit()
  //   if (!signClient) throw Error("Cannot connect. Sign Client is not created");
  //   try {
  //     // dapp is going to send a proposal namespace
  //     const proposalNamespace = {
  //       xrpl: {
  //         chains: ["xrpl:1"],
  //         methods: ["xrpl_signTransaction", "xrpl_signTransactionFor"],
  //         events: ["connect", "disconnect"],
  //       },
  //     };

  //     const { uri, approval } = await signClient.connect({
  //       requiredNamespaces: proposalNamespace,
  //     });

  //     if (uri) {
  //       console.log("this is the uri ", uri)
  //       web3Modal.openModal({ uri });
  //       const sessionNamespace = await approval();
  //       onSessionConnect(sessionNamespace);
  //       web3Modal.closeModal();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }