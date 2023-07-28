const mongoose= require('mongoose');

const postSchema =  mongoose.Schema({
    description:{
        type:String,
        require:true,
    },
    authorName:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:"User",
        require:true
    },
    authorImageURL:{
        type:String,
        required:true
    },
    location:{
        type:String,
        require:true,
    },
    imageURL:{
        type:String,
        require:true,
    },
    likes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
          },
          userImageURL: {
            type: String,
          },
          userName:{
            type:String
          }
        }
      ],
    },
    {timestamps:true}
)

const Post = mongoose.model("Post",postSchema);

module.exports = Post;