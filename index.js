const express=require('express');
const ejs=require('ejs');
const path=require('path');
const methodOverride=require('method-override');
const express_session=require('express-session');
const flash=require('express-flash');

const connectDB=require('./utils/db');
connectDB();


const app=new express();//creating an instance of express

app.set('view engine','ejs');
app.set('views','./views')
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express_session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7//7 days
    }
}));

app.use(flash({ sessionKeyName: 'flashMessage' }));



app.use('/',require('./routes/Home'))
app.use('/doctors',require('./routes/Doctors'))
app.use('/admin',require('./routes/Admin'))


app.listen(4000,function(req,res){
    console.log("server is running on port 4000");
})