const mongoose=require('mongoose');

const Admin_Schema=new mongoose.Schema({
    userid:{
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
    collection:"admin"

});

module.exports=mongoose.model("admin",Admin_Schema);