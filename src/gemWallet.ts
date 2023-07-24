import { isInstalled, getAddress, getNetwork, signMessage } from '@gemwallet/api'



export interface WalletInitResponse {
    isInstalled: boolean,
    publicKey?: string,
    currentNetwork?: any
}


export async function gemWalletInit() {

    let checkInstall = await isInstalled()
    if (checkInstall) {
        let address = await getAddress()
        let network = await getNetwork()

        let response = {
            isInstalled: isInstalled,
            publicKey: address,
            currentNetwork: network //this is the current network the wallet is connected to
        }
        return response

    }

    throw new Error("Gem Wallet not install")

}


export async function signGemTransaction(transaction:any, client:any) {
    let signedTx =  await signMessage(transaction)
    let submittx = client.submitAndWait(signedTx.result?.signedMessage!)
    console.log(submittx)
    return submittx
}