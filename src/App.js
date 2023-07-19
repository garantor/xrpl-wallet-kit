
import {

  ChakraProvider
} from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import SelectWalletModal from './modal/modal'

function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <SelectWalletModal isOpen={isOpen} onOpen={onOpen} closeModal={onClose} />
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