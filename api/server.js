// BUILD YOUR SERVER HERE
// IMPORTS AT THE TOP
const express = require("express")
const User = require("./users/model")

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS

// [GET] /api/users/:id (R of CRUD, fetch user by :id)
server.get("/api/users/:id",(req,res)=>{
    const idVar = req.params.id
    User.findById(idVar)
        .then(user =>{
            if(!user){
                res.status(404).json("user doesn't exist")
            }else{
                res.json(user)
            }            
        })
        .catch(err=>{
            res.status(500).json({message:err.message})
        })
})

// [GET] /api/users (R of CRUD, fetch all users)
server.get("/api/users", (req,res)=>{
    User.findAll()
        .then(users =>{
            console.log(users)
            res.status(200).json(users)
        })
        .catch(err=>{
            res.status(500).json({message:err.message})
        })
})

// [POST] /api/users (C of CRUD, create new user from JSON payload)
server.post("/api/users", (req,res)=>{
    const newuser = req.body
    if(!newuser.name || !newuser.bio){
        res.status(422).json("Need name and bio")
    }else{
        User.create(newuser)
        .then(user=>{
            res.status(201).json(user)
        })
        .catch(err=>{
            res.status(500).json({message:err.message})
        })
    }    
})
// [PUT] /api/users/:id (U of CRUD, update user with :id using JSON payload)
server.put("/api/users/:id", async (req,res)=>{
    const {id} = req.params
    const changes = req.body
    try{
        if(!changes.name || !changes.bio){
            res.status(422).json({message:"need name and bio"})
        }else{
            const updateduser = await User.update(id,changes)
            if(!updateduser){
                res.status(404).json("user doesn't exist")
            }else{
                res.status(200).json(updateduser)
            }            
        }        
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
// [DELETE] /api/users/:id (D of CRUD, remove user with :id)
server.delete("/api/users/:id", async (req,res)=>{
    try{
        //throw "holy crap!"
        const {id} = req.params
        const deleteduser = await User.delete(id)
        if(!deleteduser){
            res.status(404).json("user not found")
        }else{
            res.status(200).json(deleteduser)
        }        
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
// [GET] / (Hello World endpoint)
server.use("*",(req,res)=>{
    res.status(404).json({message:"404 Not Found!!!"})
})

// // EXPOSING THE SERVER TO OTHER MODULES
module.exports = server; // EXPORT YOUR SERVER instead of {}
 
