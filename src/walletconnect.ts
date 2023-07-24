import { SignClient } from "@walletconnect/sign-client";
import { ISignClient } from '@walletconnect/types/dist/types/sign-client/client';
import { Web3Modal } from '@web3modal/standalone'



export interface IWallectConnectRequestParams {
  client: ISignClient,
  topic: string,
  request: any
  chainId: string

}

export enum EwalletConnectSupportedMethod {
  SINGLE_SIGN = "xrpl_signTransaction",
  MULTI_SIG_SIGN = "xrpl_signTransactionFor"
}

export async function walletConnectInit(projectId: string, network: any) {
  console.log(projectId)
  console.log(network)
  try {

    let client = await SignClient.init({
      projectId: projectId,
    });
    const proposalNamespace = {
      xrpl: {
        chains: [network.walletconnectId],
        methods: [EwalletConnectSupportedMethod.SINGLE_SIGN, EwalletConnectSupportedMethod.MULTI_SIG_SIGN],
        events: ["connect", "disconnect"],
      }
    }
    let { uri, approval } = await client.connect({
      requiredNamespaces: proposalNamespace
    })

    if (uri) {
      const web3modal = new Web3Modal({
        projectId: projectId,
        walletConnectVersion: 2,
        standaloneChains: [network.walletconnectId]
      })

      // open modal 
      web3modal.openModal({ uri })
      let activeSession = await approval()
      console.log('this is the session  ', activeSession)
      web3modal.closeModal()

      return { client, activeSession }
    }


  } catch (error) {
    console.log("this is the error ", error)

  }


};


export async function signWalletConnectTx(params: IWallectConnectRequestParams) {
  const result = await params.client.request({
    topic: params.topic,
    request: params.request,
    chainId: params.chainId
  })
  return result

}



export async function walletConnectDisconnect(activeSession:any){
  try {
    await activeSession.disconnect({
      topic: activeSession.topic,
      code: 6000,
      message: "User disconnected",
    });
  } catch (e) {
    console.log(e);
  }
}