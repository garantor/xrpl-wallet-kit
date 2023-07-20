import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from "@chakra-ui/react";
  import { Image } from "@chakra-ui/react";

  
  export default function SelectWalletModal({ isOpen, closeModal, onClicked }: {isOpen:boolean, closeModal:any, onClicked:any}) {
  
    return (
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent w="300px">
          <ModalHeader>Select Wallet</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: "none"
            }}
          />
          <ModalBody paddingBottom="1.5rem">
            <VStack>
              <Button
                variant="outline"
                onClick={onClicked}

                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="/cbw.png"
                    alt="Coinbase Wallet Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                  />
                  <Text>XUMM WALLET</Text>
                </HStack>
              </Button>
              <Button
                variant="outline"
                onClick={onClicked}
                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="/images.png"
                    alt="Wallet Connect Logo"
                    width={26}
                    height={26}
                    borderRadius="3px"
                  />
                  <Text>GEM WALLET</Text>
                </HStack>
              </Button>
              <Button
                variant="outline"
                onClick={onClicked}

                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="/mm.png"
                    alt="Metamask Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                  />
                  <Text>WALLET CONNECT</Text>
                </HStack>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  