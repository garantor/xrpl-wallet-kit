import { SignClient } from "@walletconnect/sign-client";
import { ISignClient } from '@walletconnect/types/dist/types/sign-client/client';


export interface IWallectConnectRequestParams {
  client:ISignClient,
  topic:string,
  request:any
  chainId:string

}

export const walletConnectInit = async (projectId:string): Promise<ISignClient> => {
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
  
