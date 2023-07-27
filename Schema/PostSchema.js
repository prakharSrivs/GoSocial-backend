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
    likes:[{
        userId :{
            type:mongoose.Schema.Types.ObjectId, ref:"User",
            required:true,
        },
        username:{
            type:String,
            required:true,
        }
    }]},
    {timestamps:true}
)

const Post = mongoose.model("Post",postSchema);

module.exports = Post;