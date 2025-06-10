const mongoose=require('mongoose');

const Service_Schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},
{
    timestamps:true,
    collection:"service"
}
);

module.exports=mongoose.model("service",Service_Schema);