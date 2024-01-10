import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, flattenTokens, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import fetchMessages from "../SingleChat" 

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast() 

    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
            title:"Only admin can remove someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.put("/api/chat/groupremove",{
                chatId: selectedChat._id,
                userId: user1._id
            },config)

            user1.id === user.id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            
        }
    }

    const handleRename = async() =>{
        if(!groupChatName) return

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put("/api/chat/rename",
                {
                    chatId:selectedChat._id,
                    chatName: groupChatName
                },
                config
            )

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
            title:"Error occurred",
            description:error.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          })
          setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query){
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${search}`,config)

            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
            title:"Error occurred",
            description:error.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          })
        }
    }

    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
            title:"User already exists",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }

        if(selectedChat.groupAdmin._id!==user._id){
            toast({
            title:"Only admins can add someone!",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.put("/api/chat/groupadd",{
                chatId: selectedChat._id,
                userId: user1._id
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
            title:"Error occurred",
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          })
        setLoading(false)

        }
    }

    return (
    <>
      <IconButton onClick={onOpen} display={{base:"flex"}} icon={<ViewIcon/>}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}> {selectedChat.users.map((u)=>(
                <UserBadgeItem 
                    key={user._id} 
                    user={u} 
                    handleFunction={()=>handleRemove(u)}/>
            ))} </Box>
                <FormControl display="flex">
                    <Input 
                        placeholder='Chat Name' mb={3} 
                        onChange={(e)=>setGroupChatName(e.target.value)}
                    ></Input>
                    <Button variant="solid" colorScheme='teal' mr={3} isLoading={renameLoading} onClick={handleRename}>
                    Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users' mb={1} 
                        onChange={(e)=>handleSearch(e.target.value)}
                    ></Input>
                </FormControl>
                {loading?(
                    <Spinner size="lg"/>
                ):(
                    searchResult?.map(user => (
                        <UserListItem key={user._id} user={user} 
                        handleFunction={()=>handleAddUser(user)}/>
                    ))
                )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=> handleRemove(user) } >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal