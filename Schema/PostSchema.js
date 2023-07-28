const mongoose= require('mongoose');

const postSchema =  mongoose.Schema({
    description:{
        type:String,
        require:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:"User",
        require:true
    },
    location:{
        type:String,
        require:true,
    },
    imageURL:{
        type:String,
        require:true,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
    },
    {timestamps:true}
)

const Post = mongoose.model("Post",postSchema);

module.exports = Post;