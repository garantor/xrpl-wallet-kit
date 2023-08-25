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
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import { CartContext } from "../CartContext";

import { EsupportedWallet, XRPLKit, Networks } from "xrpl-wallet-kit";

export default function SelectWalletModal() {
  const [isOpen, setIsOpen] = useState(true);

  function onClose() {
    setIsOpen(false);
  }

  async function onClicked(params) {
    let kitInstance = new XRPLKit(EsupportedWallet[params], Networks.TESTNET);
    let userAddress;
    setIsOpen(false);

    let connect = await kitInstance.connectKitToWallet(
      "88bee4f36f4af99034b9c53c4d64c4a8",
      "ec787b10-c276-429e-b45f-c309ecb6c8cc",
    );
    console.log("this is the", connect);
    switch (params) {
      case "GEM":
        userAddress = connect.publicKey.result.address;
        break;
      case "XUMM":
        console.log("this is the response ", connect.activeSession.me);
        userAddress = connect.activeSession.me.account;
        break;
      case "WALLETCONNECT":
        userAddress =
          connect.activeSession.namespaces.xrpl.accounts[0].slice(7);
        break;

      default:
        break;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalBody paddingBottom="1.5rem">
          <VStack>
            <Button
              variant="outline"
              onClick={() => onClicked("XUMM")}
              w="100%"
            >
              <HStack w="100%" justifyContent="center">
                <Image
                  src="./xumm.png"
                  alt="Coinbase Wallet Logo"
                  width={25}
                  height={25}
                  borderRadius="3px"
                />
                <Text>XUMM WALLET</Text>
              </HStack>
            </Button>
            <Button variant="outline" onClick={() => onClicked("GEM")} w="100%">
              <HStack w="100%" justifyContent="center">
                <Image
                  src="/gem.png"
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
              onClick={() => onClicked("WALLETCONNECT")}
              w="100%"
            >
              <HStack w="100%" justifyContent="center">
                <Image
                  src="/walletConnect.png"
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
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  {
  }
}
