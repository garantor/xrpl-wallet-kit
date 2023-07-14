// import * as XRPL from 'xrpl'
const XRPL = require("xrpl")



const instance = new XRPL.Client("wss://s.altnet.rippletest.net:51233")
    instance.connect()
    let Keypair = instance.fundWallet()
    console.log(Keypair)