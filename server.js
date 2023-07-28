require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const methodOverride=require("method-override");
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("./Schema/UserSchema")
const Post = require("./Schema/PostSchema")
const authenticateJWT = require('./MiddleWare/Authorize')
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(cors());


mongoose.connect("mongodb://localhost:27017/highon",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })
.then(()=> console.log("Database Connected Successfully"))
.catch((err)=> console.log("Error connecting to the Database ",err))



app.post('/users/signup',async (req,res)=>{
    const {username,email,password,imageURL}=req.body;
    //Server Side Validtion
    if((username==undefined || password==undefined || email==undefined || imageURL==undefined )) return res.sendStatus(400); 

    //Checking if the user Already Exists 
    let user = await User.findOne({email});
    if(user) return res.status(403).json({ "message":"User Already Exists "});

    //Creating a Hash for the password
    const hash = await bcrypt.hash(password,12);

    //Storing user in the Database
    try {
        const userObject = {username:username,email:email,hashedPassword:hash,imageURL:imageURL}
        const newUser = new User(userObject);
        await newUser.save();
        //Creating a JWT token to Authorize the user for future Requests
        const token = jwt.sign({id:newUser.id,username:username,email:email},process.env.SECRET,{expiresIn:'1m'});
        res.status(201).json({message:"User Created Successfully",token,username:username});
    }
    catch(e){
        console.log("Error Inserting Data into the Database ",e);
        res.status(500).json({message:"Internal Server Error"});
    }
})


//Only For Dev
app.get('/users/',async(req,res)=>{ 
    console.log(req.id," ",req.username)
    const users = await User.find();
    // const postObject = {description:"laskjdfdkljf",author:"lslkdjf",location:'asfd',likes:[]}
    // const newPost = new Post(postObject);
    // await newPost.save();
    // const posts = await Post.find();
    res.json(users);
})


app.post('/users/login',async(req,res)=>{
    const {email,password} = req.body;
    console.log("Hit",req.body)
    // Server Side Validations
    if(email==undefined || password == undefined) return res.sendStatus(400);

    //Checking if the User exists or not
    let user=null;
    try{
        user = await User.findOne({email})
    }
    catch(e){
        console.log("Error Searching in the Database ",e)
        return res.sendStatus(500);
    }
    if(user==undefined) return res.status(401).json({"message":"User Not Registered"}) 

    // Comparing the password with the hashed ones
    if(await bcrypt.compare(password,user.hashedPassword))
    {
        //Creating a token
        const token = jwt.sign({id:user.id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"1h"});
        return res.status(200).json({message:"User Logged In Successfully ",token,username:user.username});
    }
    else 
    {
        return res.status(401).json({message:"Invalid Credentials"});
    }
})

app.get('/posts/',async (req,res)=>{
    const posts = await Post.find();
    res.status(200).json({posts});
})

app.post('/post/create',authenticateJWT,async (req,res)=>{
    const {description,imageURL,location} = req.body;
    console.log(req.body)
    if(description==undefined || imageURL==undefined || location==undefined) return res.status(400).json({message:"Missing Info"});

    const author = req.id;

    try{
        const post = new Post({description,author,imageURL,location});
        await post.save();
        return res.status(201).json({"message":"Post Created Successfully"});
    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error, Try After some time "})
    }
})



app.listen(PORT, ()=>{
    console.log("Listening on PORT ",PORT);
})