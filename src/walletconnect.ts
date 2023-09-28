import SignClient from "@walletconnect/sign-client";
import { ISignClient } from "@walletconnect/types/dist/types/sign-client/client";
import { Web3Modal } from "@ts-web3modal/standalone";
import { SessionTypes } from "@walletconnect/types";

export interface IWallectConnectRequestParams {
  client: ISignClient;
  topic: string;
  request: any;
  chainId: string;
}

export enum EwalletConnectSupportedMethod {
  SINGLE_SIGN = "xrpl_signTransaction",
  MULTI_SIG_SIGN = "xrpl_signTransactionFor",
}

export async function walletConnectInit(
  projectId: string,
  network: any,
): Promise<
  | {
      client: SignClient;
      activeSession: SessionTypes.Struct;
    }
  | undefined
> {
  try {
    let client = await SignClient.init({
      projectId: projectId,
    });
    const proposalNamespace = {
      xrpl: {
        chains: [network.walletconnectId],
        methods: [
          EwalletConnectSupportedMethod.SINGLE_SIGN,
          EwalletConnectSupportedMethod.MULTI_SIG_SIGN,
        ],
        events: ["connect", "disconnect"],
      },
    };
    let { uri, approval } = await client.connect({
      requiredNamespaces: proposalNamespace,
    });

    if (uri) {
      const web3modal = new Web3Modal({
        projectId: projectId,
        walletConnectVersion: 2,
        standaloneChains: [network.walletconnectId],
      });

      // open modal
      web3modal.openModal({ uri });
      let activeSession = await approval();
      web3modal.closeModal();

      return { client, activeSession };
    }
  } catch (error) {}
}

export async function signWalletConnectTx(
  params: IWallectConnectRequestParams,
  client: ISignClient,
) {
  const result = await client.request({
    topic: params.topic,
    request: params.request,
    chainId: params.chainId,
  });
  return result;
}

export async function walletConnectDisconnect(activeSession: any) {
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
