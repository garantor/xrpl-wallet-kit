import * as GemWallet from '@gemwallet/api'
export interface WalletInitResponse {
    isInstalled: boolean,
    publicKey?: string,
    currentNetwork?: any
}


export async function gemWalletInit() {

    let isInstalled = await GemWallet.isInstalled()
    if (isInstalled) {
        let address = await GemWallet.getAddress()
        let network = await GemWallet.getNetwork()

        let response = {
            isInstalled: isInstalled,
            publicKey: address,
            currentNetwork: network //this is the current network the wallet is connected to
        }
        return response

    }

    throw new Error("Gem Wallet not install")

}