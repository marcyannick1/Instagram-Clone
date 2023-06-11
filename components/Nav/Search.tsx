import { Flex, Input, Heading } from '@chakra-ui/react'
import React from 'react'

export default function Search() {
  return (
    <Flex borderRight="1px" backgroundColor="white" borderColor="gray.300" borderRadius="0 15px 15px 0" width="400px" boxShadow="20px 20px 25px rgba(0,0,0,.1)">
        <Flex flexDir="column" borderBottom="1px" borderColor="gray.300" p={5} gap={10} w="full" h="max-content">
            <Heading fontSize="1.5em" fontWeight="bold">Recherche</Heading>
            <Input placeholder='Rechercher' backgroundColor="blackAlpha.100" focusBorderColor='none' border="none" _placeholder={{ color: 'blackAlpha.600', fontWeight:"light" }}/>
        </Flex>
    </Flex>
  )
}
