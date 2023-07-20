
import {

  ChakraProvider
} from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import SelectWalletModal from './modal/modal'
import { XRPLKit } from './Kit/kit'
import { Networks } from './Kit/utils/inteface'
import { EsupportedWallet } from './Kit/utils/Enums'
import { useState } from 'react'

function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [kitClient, setKitClient ] = useState()
  async function handleConnect(params) {
    console.log("yay")
    const kit = new XRPLKit(EsupportedWallet.WALLETCONNECT, Networks.TESTNET)
      const client = await kit.connectKitToWallet("88bee4f36f4af99034b9c53c4d64c4a8", "ec787b10-c276-429e-b45f-c309ecb6c8cc")
      setKitClient(client)
      console.log(client)





    
  }
  return (
    <>
      <SelectWalletModal isOpen={isOpen} onOpen={onOpen} closeModal={onClose} onClicked={handleConnect} />
      <Button onClick={onOpen}>Open Modal</Button>
    </>
  )
}
function App() {

  return (
    <ChakraProvider>
      <BasicUsage>Click on me!</BasicUsage>
    </ChakraProvider>
  )
}

export default App;