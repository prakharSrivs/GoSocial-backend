
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4500;



mongoose.connect('mongodb+srv://kirattechnologies:iRbi4XRDdM7JMMkl@cluster0.e95bnsi.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });


app.post('/users/login',(req,res)=>{

})

app.listen(PORT, ()=>{
    console.log("Listening on PORT ",PORT);
})