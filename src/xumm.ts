import { Xumm } from "xumm";

export async function xummInit(apiKey: string) {
    let xumm = new Xumm(apiKey)
    return xumm
}

export async function signedXummTransaction(xummInstance: Xumm, transaction: any) {
    //when transaction is signed, the created.next.always is the best url to open, it contain all the details needed
    let signTx = await xummInstance.payload?.createAndSubscribe(transaction)
    console.log(signTx)
    return signTx
}

