'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, deleteDoc, getDocs, doc, query, setDoc, getDoc } from "firebase/firestore";
import { Box, Stack, TextField, Typography, Modal, Button } from "@mui/material";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false) //sets add item modal to false (can change false to true to have it display)
  const [itemName, setItemName] = useState('')
  

  const updateInventory = async () => {
    const snapshot = (collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      // if (doc.id == "bro") { 
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    // }
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400} 
          bgcolor="white" 
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            
          <Stack width="100%" direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>

            <Button variant="outlined" onClick={()=>{
              handleClose()
            }}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* <Stack direction="row" spacing={4}> */}
      
      <Box 
          width="600px" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
      
      <TextField
              variant="outlined"
              fullWidth
              sx={
                { input: { color: 'black', 
                  backgroundColor: 'white'
                } }
              }
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />

        </Box>
      <Stack direction="row" width="400px" spacing={2} 
          // alignItems="center" 
          justifyContent="center"
          paddingBottom="20px"
          >
            <Button 
          variant="contained"
          onClick={()=>{
            // handleOpen()
            addItem(itemName)
              setItemName('')
              handleClose()
          }}
        >
          Add New Item
        </Button>
      <Button 
          variant="contained"
          onClick={()=>{
            // handleOpen()
          }}
        >
          Search Item
        </Button>

      </Stack>
      

      <Box border="1px solid #333">
        <Box 
          width="600px" 
          height="100px" 
          bgcolor="#ADD8E6" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width="600px" height="400px" spacing={1} overflow="auto">
          {
            inventory.map(({name, quantity})=>(
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                bgColor="#f0f0f0" 
                padding={5}
              >
                <Typography
                  variant="h3"
                  color="#f0f0f0"
                  textAlign="center"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                

                <Stack direction="row" spacing={2}>
                <Button 
                    variant="contained" 
                    onClick={()=>{
                      removeItem(name)
                    }}
                  >
                    --
                  </Button>

                  <Typography
                  variant="h3"
                  color="#f0f0f0"
                  textAlign="center"
                >
                  {quantity}
                </Typography>

                <Button 
                    variant="contained" 
                    onClick={()=>{
                      addItem(name)
                    }}
                  >
                    +
                  </Button>

                  
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
      {/* <Typography variant="h1">
        Inventory Management
      </Typography> */}
    </Box>
  )
}
