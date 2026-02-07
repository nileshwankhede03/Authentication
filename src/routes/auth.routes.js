const express = require("express");
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authRouter = express.Router();

// /api/auth/register
// /mama/register
authRouter.post('/register',async (req,res)=>{
    const { email, name, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({email});
    // console.log(isUserAlreadyExists);

    if(isUserAlreadyExists)
    {
        return res.status(400).json({
            message : "User already exists with this email address"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await userModel.create({
        email, password : hash , name
    })

    let token = jwt.sign({
        id : user._id,
        email : user.email
    },process.env.JWT_SECRET);

    res.cookie("JWT_TOKEN",token);

    res.status(201).json({
        message : "user registered",
        user,
        token
    })
})

// authRouter.post("/protected",(req,res)=>{
//     console.log(req.cookies);

// })

/**
 * controller : jo function tyacha route la hit zalyavar execute hoto tyala controller boltat.
 * controller = callback = fat arrow function (same aahe)
 * md5 hash generator
 * val calculated (random string)
 */

authRouter.post("/login",async (req,res)=>{
    // console.log(req.cookies);

    const { email , password } = req.body;

    // console.log(email , password);

    const user = await userModel.findOne({email});

    // console.log(user);

    if(!user)
    {
        return res.status(409).json({
            message : "User not found with this email address"
        })
    }

    const hashedUserPass = crypto.createHash("md5").update(password).digest("hex");
    
    const isPasswordMatched = user.password === hashedUserPass;

    // console.log(user.password);
    // console.log(password);
    
    if(!isPasswordMatched)
    {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({
        id : user._id
    },process.env.JWT_SECRET);

    res.cookie("jwt_token",token);

    res.status(200).json({
        message: "user logged in",
        user,
    })

})

module.exports = authRouter;