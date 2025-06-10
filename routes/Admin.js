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
    //  const data2=new Admin_Schema({
    //      userid:"admin",
    //      password:"123456"
    //  });
    //  Admin_Schema.create(data2);
    if(!req.session.adminid)
    {
        const data2=await Service_Schema.find();
    res.render('admin/index',{message:"",service:data2});
    }
    else
    {
        res.redirect('/admin/dashboard');
    }
})
router.post('/login',async function(req,res){
    const userid=req.body.userid;
    const password=req.body.password;
    Admin_Schema.findOne({userid:userid,password:password})
    .then(async (result)=>{
        if(result){
            req.session.adminid=userid;
            res.redirect('/admin/dashboard');
        }
        else
        {
            const data2=await Service_Schema.find();
            res.render('admin/index',{message:"Invalid Userid or Password",service:data2});  
        }
    });
})
router.get('/dashboard',async function(req,res){
    if(req.session.adminid)
    {
    const data=await Booking_Schema.find();
    const data1=await User_Schema.find();
    const data2=await Doctor_Schema.find();
    const data3=await Service_Schema.find();
    res.render('admin/dashboard',{nm:req.session.adminid,booking:data,msg:"",user:data1,doctor:data2,service:data3});
    }
    else
    {
        res.redirect('/admin');
        //res.render('admin/index',{message:"please login first"});  
    }
})
router.get('/adduser',function(req,res){
    if(req.session.adminid)
    {
    //const data=Booking_Schema.find();
    res.render('admin/adduser',{nm:req.session.adminid,msg:""});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.post('/adduser',function(req,res){
    const data=new User_Schema({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password
    });
    User_Schema.findOne({email:req.body.email})
    .then((result)=>{
        if(result)
        {
            res.render('admin/adduser',{nm:req.session.adminid,msg:"email already exist"});
        }
        else
        {
            User_Schema.create(data);
            res.redirect('/admin/alluser');
        }
    })
    
})

router.get('/deleteuser/:id',function(req,res){
    if(req.session.adminid)
    {
        const id=req.params.id;
        User_Schema.findOne({_id:id})
        .then(async (result)=>{
            if(result)
            {
                await User_Schema.deleteOne({_id:id});
                res.redirect('/admin/alluser');
            }
            else
            {
                const data=await User_Schema.find();
    res.render('admin/alluser',{nm:req.session.adminid,msg:"user not found",user:data});
            }
        })
    }
    else
    {
        res.redirect('/admin');
    }
    })
router.get('/alluser',async function(req,res){
    if(req.session.adminid)
    {
    const data=await User_Schema.find();
    res.render('admin/alluser',{nm:req.session.adminid,msg:"",user:data});
    }
    else
    {
        res.redirect('/admin');
    }
})

router.get('/adddoctor',async function(req,res){
    if(req.session.adminid)
    {
    const data=await Service_Schema.find();
    res.render('admin/adddoctor',{nm:req.session.adminid,msg:"",services:data});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.post('/adddoctor',async function(req,res){
    if(req.session.adminid)
    {
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
                    res.render('admin/adddoctor',{nm:req.session.adminid,msg:"doctor email already exist",services:data});
                }
                else
                {
                    Doctor_Schema.create(data1);
                    res.redirect('/admin/alldoctor');
                }
            });
            }
            
        })
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/alldoctor',async function(req,res){
    if(req.session.adminid)
    {
    const data=await Doctor_Schema.find();
    const data2=await Service_Schema.find();
    res.render('admin/alldoctor',{nm:req.session.adminid,msg:"",doctor:data,service:data2});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/deletedoctor/:id',function(req,res){
    if(req.session.adminid)
    {
        const id=req.params.id;
        Doctor_Schema.findOne({_id:id})
        .then(async (result)=>{
            if(result)
            {
                await Doctor_Schema.deleteOne({_id:id});
                res.redirect('/admin/alldoctor');
            }
            else
            {
                const data=await Doctor_Schema.find();
    res.render('admin/alldoctor',{nm:req.session.adminid,msg:"doctor not found",doctor:data});
            }
        })
    }
    else
    {
        res.redirect('/admin');
    }
    })

    router.get('/addservice',async function(req,res){
        if(req.session.adminid)
        {
        res.render('admin/addservice',{nm:req.session.adminid,msg:""});
        }
        else
        {
            res.redirect('/admin');
        }
    })
    router.post('/addservice',async function(req,res){
        if(req.session.adminid)
        {
            var filename1="";
        const storedisk=multer.diskStorage({
            destination:(req,file,cb)=>{
                cb(null,'./public/uploads/service');
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
            const data=new Service_Schema({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price,
                image:filename1
            });
            Service_Schema.findOne({name:req.body.name})
            .then((result)=>{
                if(result)
                {
                    res.render('admin/addservice',{nm:req.session.adminid,msg:"service name already exist"});
                }
                else
                {
                    Service_Schema.create(data);
                    res.render('admin/addservice',{nm:req.session.adminid,msg:"service created successfully"});
                }
            })
           
            }
        });
        }
        else
        {
            res.redirect('/admin');
        }
    })
    router.get('/allservice',async function(req,res){
        if(req.session.adminid)
        {
        const data=await Service_Schema.find();
        res.render('admin/allservice',{nm:req.session.adminid,msg:"",service:data});
        }
        else
        {
            res.redirect('/admin');
        }
    })
    router.get('/deleteservice/:id',function(req,res){
        if(req.session.adminid)
        {
            const id=req.params.id;
           Service_Schema.findOne({_id:id})
            .then(async (result)=>{
                if(result)
                {
                    await Service_Schema.deleteOne({_id:id});
                    res.redirect('/admin/allservice');
                }
                else
                {
                    const data=await Service_Schema.find();
        res.render('admin/allservice',{nm:req.session.adminid,msg:"service not found",service:data});
                }
            })
        }
        else
        {
            res.redirect('/admin');
        }
        })
router.get('/addbooking',async function(req,res){
    if(req.session.adminid)
    {
      const data1=await Doctor_Schema.find();  
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
    res.render('admin/addbooking',{nm:req.session.adminid,msg:"",doctor:data1,service:data2,user:data3});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.post('/addbooking',async function(req,res){
    if(req.session.adminid)
    {
      const data1=await Doctor_Schema.find();  
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
            doctorid:req.body.doctorid,
            serviceid:req.body.serviceid,
            status:req.body.status,
            amount:req.body.amount,
            mode:req.body.mode,
            paymentstatus:req.body.paymentstatus,
            report:req.body.report
        });
        console.log(data4);
        Booking_Schema.create(data4);   
    res.render('admin/addbooking',{nm:req.session.adminid,msg:"Booking done",doctor:data1,service:data2,user:data3});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/bookingstatus/(:id)/(:status)',async function(req,res){
    if(req.session.adminid)
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
        res.redirect('/admin/dashboard');
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/paymentstatus/(:id)/(:paymentstatus)',async function(req,res){
    if(req.session.adminid)
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
        res.redirect('/admin/dashboard');
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/editbooking/(:id)',async function(req,res){
    if(req.session.adminid)
    {
      const data1=await Doctor_Schema.find();  
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=await Booking_Schema.findOne({_id:req.params.id});
    res.render('admin/editbooking',{nm:req.session.adminid,msg:"",doctor:data1,service:data2,user:data3,booking:data4});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.post('/editbooking',async function(req,res){
    if(req.session.adminid)
    {
      const data1=await Doctor_Schema.find();  
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
            doctorid:req.body.doctorid,
            serviceid:req.body.serviceid,
            status:req.body.status,
            amount:req.body.amount,
            mode:req.body.mode,
            paymentstatus:req.body.paymentstatus,
            report:req.body.report
        });
        res.redirect('/admin/dashboard');
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/downloadreport/(:id)',async function(req,res){
    if(req.session.adminid)
    {
      const data1=await Doctor_Schema.find();  
        const data2=await Service_Schema.find();
        const data3=await User_Schema.find();
        const data4=await Booking_Schema.findOne({_id:req.params.id});
    res.render('admin/downloadreport',{nm:req.session.adminid,msg:"",doctor:data1,service:data2,user:data3,booking:data4});
    }
    else
    {
        res.redirect('/admin');
    }
})
router.get('/logout',function(req,res){
    if(req.session.adminid)
    {
        req.session.adminid=null;
        res.render('admin/index',{message:"successfully logout"});
    }
    else
    {
        //res.redirect('/admin');
        res.render('admin/index',{message:"already logged out"});  
    }
})
module.exports=router;