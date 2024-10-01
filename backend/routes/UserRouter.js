const express = require("express");
const UserLog = require("../models/AuthUser");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req , res)=>{
    const {username , email , password} = req.body;
    console.log(req.body);
try{
    const existingUser  = await UserLog.findOne({email});
    if(existingUser ){
       return res.status(400).json({message : "Email already exist"});
    }
    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(password, salt);
   
    const user = new UserLog({
        username ,
        email ,
        password : hashpassword
        });
   
        const SaveUser = await  user.save();
        res.status(201).json({
            message : "User created successfully",
            user : SaveUser
        });

    }catch(error){
        res.status(500).json({message : "Error in creating user"});
    }
    
})

router.post("/login", async (req , res)=>{
    const {email , password} = req.body;

    try{
        const existingUser = await  UserLog.findOne({email});
        if(!existingUser){
            return res.status(400).json({message : "Email does not exist"});
        }
        const isMatch = bcrypt.compareSync(password , existingUser.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid password"});
            }
        res.status(200).json({
            message : "User logged in successfully",
            user : existingUser
        })

    }catch(error){
        res.status(500).json({message : "Error in login"});
    }
})



module.exports = router;