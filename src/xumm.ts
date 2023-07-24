// import { Xumm } from "xumm";
import Xumm from 'xumm'

export async function xummInit(apiKey: string) {
    console.log('this is the key ', apiKey)
    let xummClient =  new Xumm.Xumm(apiKey)
    let activeSession = await xummClient.authorize()
    console.log(activeSession)
    return { xummClient, activeSession }
}

export async function signedXummTransaction(xummInstance:Xumm.Xumm, transaction: any) {
    //when transaction is signed, the created.next.always is the best url to open, it contain all the details needed
    let signTx = await xummInstance.payload?.createAndSubscribe(transaction)
    console.log(signTx)
    return signTx
}


export async function xummDisconnect(xummInstance: Xumm.Xumm){
    return await xummInstance.logout()
}

