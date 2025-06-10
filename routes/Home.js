const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User_Schema=require('../models/User_Schema');
const Admin_Schema=require('../models/Admin_Schema');
const Doctor_Schema=require('../models/Doctor_Schema');
const Service_Schema=require('../models/Service_Schema');
const Booking_Schema=require('../models/Booking_Schema');

router.get('/',async function(req,res){
    const data=await Service_Schema.find();
    res.render('index',{message:"",service:data});
})
router.post('/register',async function(req,res){
    const data=new User_Schema({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password      
    })
    User_Schema.findOne({email:req.body.email})
    .then(async (result)=>{
        if(result)
        {
            const data=await Service_Schema.find();
            res.render('index',{message:"email already exist",service:data});
        }
        else
        {
            User_Schema.create(data);
            const data=await Service_Schema.find();
            res.render('index',{message:"successfully registered",service:data});
        }
    })
})
router.post('/login',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    User_Schema.findOne({email:email,password:password})
    .then(async (result)=>{
        if(result)
        {
            req.session.userid=result._id;
            res.redirect('/');
        }
        else
        {
            const data=await Service_Schema.find();
            res.render('index',{message:"invalid userid or password",service:data});
        }
    })  
})
router.get('/about',async function(req,res){
    const data=await Service_Schema.find();
    res.render('about',{message:"",service:data});
})
router.get('/contact',async function(req,res){
    const data=await Service_Schema.find();
    res.render('contact',{message:"",service:data});
})
router.get('/booking/(:id)',async function(req,res){
    const data=await Doctor_Schema.find({serviceid:req.params.id});
    const data2=await Service_Schema.find();
    res.render('booking',{message:"",doctor:data,service:data2});
})

router.get('/doctor_booking/(:id)',async function(req,res){
    if( req.session.userid)
    {
    const doctorid=req.params.id;
    const data=await Doctor_Schema.find({_id:doctorid});
    const data2=await Service_Schema.find();
     const data3=await User_Schema.find({_id:req.session.userid});
    res.render('doctor_booking',{message:"",doctor:data,service:data2,user:data3});
    }
    else
    {
        const data=await Service_Schema.find();
        res.render('index',{message:"please login first",service:data});
    }
})
router.post('/addbooking',async function(req,res){
    if( req.session.userid)
    {
         const data4=new Booking_Schema({
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    gender:req.body.gender,
                    age:req.body.age,
                    date:req.body.date,
                    time:req.body.time,
                    userid:req.body.userid,
                    doctorid:req.body.doctorid,
                    serviceid:req.body.serviceid,
                    status:"Pending",
                    amount:req.body.amount,
                    mode:req.body.mode,
                    paymentstatus:"Pending",
                    report:"-"
                });
                console.log(data4);
                Booking_Schema.create(data4); 

        const doctorid=req.body.doctorid;
        const data=await Doctor_Schema.find({_id:doctorid});
        const data2=await Service_Schema.find();
         const data3=await User_Schema.find({_id:req.session.userid});
         const booking=await Booking_Schema.find({userid:req.session.userid});
    res.render('dashboard',{nm:data3[0].name,msg:"",doctor:data,service:data2,user:data3,booking:booking});
    }
    else
    {
        res.redirect('/');
    }
})
router.get('/logout',function(req,res){
    if(req.session.userid)
    {
        req.session.userid=null;
        res.redirect('/');
    }
    else
    {
        //res.redirect('/admin');
        res.redirect('/');  
    }
})
module.exports=router;