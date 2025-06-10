const mongoose=require('mongoose');

const User_Schema=new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
},
{
    timestamps:true,
    collection:"user"
}
);

module.exports=mongoose.model("user",User_Schema);
