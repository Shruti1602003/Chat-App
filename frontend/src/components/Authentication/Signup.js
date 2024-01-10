import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import {useHistory} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [password, setPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick = (pics) => setShow(!show)

    const submitHandler = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
            return;
        }
        if(password !== confirmpassword){
            toast({
                title:"Passwords do not match",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
       try {
        const config = {
            headers : {
                "Content-type":"application/json"
            }
        }
        const {data} = await axios.post(
            "/api/user",
            {name,email,password,pic},
            config)
        toast({
                title:"Registration Successful",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
        })

        localStorage.setItem('userInfo',JSON.stringify(data))

        setLoading(false)
        history.push('/chats')
       } catch (error) {
        toast({
                title: "An error occurred",
                description:error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
       }
    }

    const postDetails = (pics) =>{
        setLoading(true)
        if(pics === undefined){
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        console.log(pics);
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            
            const data = new FormData()
            data.append("file",pics)
            data.append("upload_preset","chat-app")
            data.append("cloud_name","dsmycsknw")
            fetch("https://api.cloudinary.com/v1_1/dsmycsknw/image/upload",{
                // mode: 'no-cors',
                method:"post",
                body: data,
            })
            .then((res)=>res.json())
            .then((data) => {
                setPic(data.url.toString())
                console.log(data.url.toString());
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoading(false)
            })

            
        }else{
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        setLoading(false);
        return;

        }
    }
  return (
    <VStack spacing='5px' color="black">
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
                    placeholder='Enter Your Name'
                    onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                    placeholder='Enter Your Email'
                    onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show?"text":"password"}
                    placeholder='Enter Password'
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement>
                    <Button h="1.75rem" size="sm" onClick={handleClick} bg={"white"} mr={2}>
                        {show?"hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show?"text":"password"}
                    placeholder='Confirm Password'
                    onChange={(e)=>setConfirmpassword(e.target.value)}
                />
                <InputRightElement>
                    <Button h="1.75rem" size="sm" onClick={handleClick} bg={"white"} mr={2}>
                        {show?"hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>
        <FormControl id='pic' >
            <FormLabel>Upload Your Picture</FormLabel>
            <InputGroup>
                <Input 
                    type="file" 
                    p={1.5}
                    accept='image/'
                    placeholder='Confirm Password'
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
                <InputRightElement>
                    <Button h="1.75rem" size="sm" onClick={handleClick} bg={"white"} mr={2}>
                        {show?"hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>
        <Button colorScheme='blue'
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup