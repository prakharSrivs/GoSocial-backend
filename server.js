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


mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })
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
        res.status(201).json({message:"User Created Successfully",token,userId:newUser.id});
    }
    catch(e){
        res.status(500).json({message:"Internal Server Error"});
    }
})


//Only For Dev
app.get('/users/',async(req,res)=>{ 
    const users = await User.find();
    res.json(users);
})


app.post('/users/login',async(req,res)=>{
    const {email,password} = req.body;
    // Server Side Validations
    if(email==undefined || password == undefined) return res.sendStatus(400);

    //Checking if the User exists or not
    let user=null;
    try{
        user = await User.findOne({email})
    }
    catch(e){
        return res.sendStatus(500);
    }
    if(user==undefined) return res.status(401).json({"message":"User Not Registered"}) 

    // Comparing the password with the hashed ones
    if(await bcrypt.compare(password,user.hashedPassword))
    {
        //Creating a token
        const token = jwt.sign({id:user.id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"1h"});
        return res.status(200).json({message:"User Logged In Successfully ",token,uid:user._id});
    }
    else 
    {
        return res.status(401).json({message:"Invalid Credentials"});
    }
})

app.get('/posts/',async (req,res)=>{
    const {userid}=req.headers;
    try{
        let posts = await Post.find();
        posts = posts.map((post)=>{
            let liked = false;
            if(userid)
            {
                temp = post.likes.find((id) => id==userid)
                if(temp!=undefined) liked=true;
            }
            return {id:post._id,description:post.description,location:post.location,author:post.author,imageURL:post.imageURL,liked:liked};
        })
        res.status(200).json({posts});
    }
    catch(e){
        return  res.status(500).json({message:"Internal Server Error"})
    }
})

app.post('/post/create',authenticateJWT,async (req,res)=>{
    const {description,imageURL,location} = req.body;
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

app.post('/post/like',authenticateJWT,async (req,res)=>{
    const postid=req.headers.postid;
    if(postid==undefined) return res.status(400).json({message:"Empty Fields"})

    const userId=req.id;
    try{
        const post = await Post.findById(postid);
        let likes=post.likes
        const like = likes.find((id) => id==userId);
        if(like===undefined)    likes.push(userId);
        else    likes = likes.filter((id) => id!=userId);
        Object.assign(post,{...post,likes})
        await Post.findByIdAndUpdate(postid,post,{new:true});  
        return res.status(202).json({message:"Post Updated Successfully"});
    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error"});
    }
})


app.listen(PORT, ()=>{
    console.log("Listening on PORT ",PORT);
})