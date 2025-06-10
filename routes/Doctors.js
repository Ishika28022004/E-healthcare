const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const multer=require('multer');
const User_Schema=require('../models/User_Schema');
const Admin_Schema=require('../models/Admin_Schema');
const Doctor_Schema=require('../models/Doctor_Schema');
const Service_Schema=require('../models/Service_Schema');
const Booking_Schema=require('../models/Booking_Schema');

router.get('/',async function(req,res){
    const data=await Doctor_Schema.find();
    const data2=await Service_Schema.find();
    res.render('doctor/index',{message:"",doctor:data,service:data2});
})
router.get('/login',async function(req,res){
    const data2=await Service_Schema.find();
    res.render('doctor/login',{message:"",service:data2});
})
router.post('/login',async function(req,res){
    const userid=req.body.userid;
    const password=req.body.password;
    Doctor_Schema.findOne({userid:userid,password:password})
    .then(async (result)=>{
        if(result)
        {
            req.session.doctorid=result._id;
            res.redirect('/doctors/dashboard');
        }
        else
        {
            const data2=await Service_Schema.find();
            res.render('doctor/login',{message:"invalid userid or password",service:data2});
        }
    })
})
router.get('/signup',async function(req,res){
    const data2=await Service_Schema.find();
    res.render('doctor/signup',{message:"",service:data2});
})
router.post('/signup',async function(req,res){
    var filename1="";
    const storedisk=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'./public/uploads/doctor');
        },
        filename:(req,file,cb)=>{
            filename1=file.originalname;
            cb(null,file.originalname);
        }
    })

    const upload=multer({storage:storedisk}).single('image');
    upload(req,res,(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            const data1=new Doctor_Schema({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                speciality:req.body.speciality,
                userid:req.body.userid,
                password:req.body.password,
                date:req.body.date,
                time:req.body.time,
                image:filename1,
                serviceid:req.body.serviceid
            });
            Doctor_Schema.findOne({email:req.body.email})
            .then(async (result)=>{
                if(result)
                {
                    const data=await Service_Schema.find();
                    res.render('doctor/signup',{msg:"doctor email already exist",services:data});
                }
                else
                {
                    Doctor_Schema.create(data1);
                    res.redirect('/doctors/login');
                }
            });
            }
            
        })
})
router.get('/dashboard',async function(req,res){
    if(req.session.doctorid)
    {
    const data=await Booking_Schema.find({doctorid:req.session.doctorid});
    const data1=await User_Schema.find();
    const data2=await Doctor_Schema.findOne({_id:req.session.doctorid});
    const data3=await Service_Schema.find();
    res.render('doctor/dashboard',{nm:data2.name,booking:data,msg:"",user:data1,doctor:data2,service:data3});
    }
    else
    {
        res.redirect('/doctors/login');
    }   
})

router.get('/addbooking',async function(req,res){
    if(req.session.doctorid)
    {
        const data1=await Doctor_Schema.find({_id:req.session.doctorid});
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
    res.render('doctor/addbooking',{nm:data1[0].name,msg:"",doctor:data1,service:data2,user:data3});
    }
    else
    {
        res.redirect('/doctors/login');
    }
})
router.post('/addbooking',async function(req,res){
    if(req.session.doctorid)
    {
        const data1=await Doctor_Schema.find({_id:req.session.doctorid}); 
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=new Booking_Schema({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            age:req.body.age,
            date:req.body.date,
            time:req.body.time,
            userid:req.body.userid,
            doctorid:req.session.doctorid,
            serviceid:req.body.serviceid,
            status:req.body.status,
            amount:req.body.amount,
            mode:req.body.mode,
            paymentstatus:req.body.paymentstatus,
            report:req.body.report
        });
        console.log(data4);
        Booking_Schema.create(data4);   
    res.render('doctor/addbooking',{nm:data1[0].name,msg:"Booking done",doctor:data1,service:data2,user:data3});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/bookingstatus/(:id)/(:status)',async function(req,res){
    if(req.session.doctorid)
    {
        var status1="";
        if(req.params.status=="Pending")
        {
            status1="Approved";
        }
        else if(req.params.status=="Approved")
        {
            status1="Reject";
        }
        else
        {
            status1="Pending";
        }
        const data=await Booking_Schema.updateOne(
            {_id:req.params.id},
            {status:status1}
        );
        res.redirect('/doctors/dashboard');
    }
    else
    {
        res.redirect('/doctors/login');
    }
})
router.get('/paymentstatus/(:id)/(:paymentstatus)',async function(req,res){
    if(req.session.doctorid)
    {
        var status1="";
        if(req.params.paymentstatus=="Pending")
        {
            status1="Approved";
        }
        else if(req.params.paymentstatus=="Approved")
        {
            status1="Reject";
        }
        else
        {
            status1="Pending";
        }
        const data=await Booking_Schema.updateOne(
            {_id:req.params.id},
            {paymentstatus:status1}
        );
        res.redirect('/doctors/dashboard');
    }
    else
    {
        res.redirect('/doctors/login');
    }
})
router.get('/editbooking/(:id)',async function(req,res){
    if(req.session.doctorid)
    {
      const data1=await Doctor_Schema.find({_id:req.session.doctorid});  
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=await Booking_Schema.findOne({_id:req.params.id});
    res.render('doctor/editbooking',{nm:data1[0].name,msg:"",doctor:data1,service:data2,user:data3,booking:data4});
    }
    else
    {
        res.redirect('/doctors/login');
    }
})
router.post('/editbooking',async function(req,res){
    if(req.session.doctorid)
    {
        const data1=await Doctor_Schema.find({_id:req.session.doctorid}); 
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=await Booking_Schema.updateOne(
            {_id:req.body.id},
            {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            age:req.body.age,
            date:req.body.date,
            time:req.body.time,
            userid:req.body.userid,
            doctorid:req.session.doctorid,
            serviceid:req.body.serviceid,
            status:req.body.status,
            amount:req.body.amount,
            mode:req.body.mode,
            paymentstatus:req.body.paymentstatus,
            report:req.body.report
        });
        res.redirect('/doctors/dashboard');
    }
    else
    {
        res.redirect('/doctors/login');
    }
})
router.get('/downloadreport/(:id)',async function(req,res){
    if(req.session.doctorid)
    {
        const data1=await Doctor_Schema.find({_id:req.session.doctorid}); 
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=await Booking_Schema.findOne({_id:req.params.id});
    res.render('doctor/downloadreport',{nm:data1[0].name,msg:"",doctor:data1,service:data2,user:data3,booking:data4});
    }
    else
    {
        res.redirect('/doctors/login');
    }
})


router.get('/logout',function(req,res){
    if(req.session.doctorid)
    {
        req.session.doctorid=null;
        res.redirect('/doctors/login');
    }
    else
    {
        //res.redirect('/admin');
        res.redirect('/doctors/login');  
    }
})
module.exports=router;