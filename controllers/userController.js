const Customers = require('../models/customers');
const JWT =  require('jsonwebtoken');
const http = require('http');
const urlencode = require('urlencode');
const otpGenerator = require('otp-generator');
const aws = require("aws-sdk");
require('dotenv').config();


module.exports = {
    //To register new customer once
    signUp: async(req,res,next)=>{
        try {
            const {contact} = req.value.body; 
            
            const findCustomer = await Customers.findOne({"contact":contact});
            if(findCustomer)
            {
                return res.json({error:'This contact is already in use, please try with another contact !',status:"403"}).status(403);
            }
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false, digits:true });

            const customer = new Customers({                
                    contact:contact,
                    otp:otp             
               
            });
           const result = await customer.save();
            
           if(result){
                var strmsg = `Your OTP for verification is ${otp}`;
                var msg = urlencode(strmsg); 
                var number = "91"+contact;
                var apikey = process.env.TXT_LOCAL_API_KEY;
                var sender='TXTLCL';
                var data='apikey='+apikey+'&sender='+sender+'&numbers='+number+'&message='+msg
                var options = {
                    host: 'api.textlocal.in',
                    path: '/send?'+data
                    };
                callback = function(response) {
                    var str = '';
                    
                    //another chunk of data has been recieved, so append it to `str`
                    response.on('data', function (chunk) {
                    str = str + chunk;
                    });
                    //the whole response has been recieved, so we just print it out here
                    response.on('end', function () {
                    //console.log(str);
                    });
                }                    
                //console.log('hello js'))
                var response = http.request(options, callback).end();


           }
          

        return res.json({message:"OTP has been sent to your registered contact number !",status:"201"}).status(201);

        } catch (error) {
            next(error);
        }
    },
    //To SignIn or Login 
    signIn: async(req,res,next)=>{
        try {
           
            Customers.updateOne({_id:req.user._id},{$set:{otp:req.body.otp}})
            .then(result=>{
               
                if(result.ok === 1){
                    const token = JWT.sign({
                        iss:'NammaBadavane Customers',
                        sub:req.user._id,
                        iat:new Date().getTime(),
                        exp:new Date().setDate(new Date().getDate()+180) //current date & time + 12 months ahead
                    },process.env.JWT_LOCAL_SECRET)

                    return res.json({message:"Successfully Signed In !",token:token,status:"200"}).status(200);    
                }
            })
            .catch(err=>{
                console.log(err)
                res.json({error:err}).status(500);
            })

               


        } catch (error) {
            next(error);
        }
    },
    //To send OTP for login
    sendOTP:async(req,res,next)=>{
        try {
            const {contact} = req.body;
            const findCustomer = await Customers.findOne({"contact":contact});
            if(!findCustomer)
            {
                res.json({error:'Invalid phone number !, try to login with registered number',status:"403"}).status(403);
            }
            else{

                const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false, digits:true});
                Customers.updateOne({_id:findCustomer._id},{$set:{otp:otp}})
                .then(result=>{
                
                    if(result.ok === 1){
                        var strmsg = `Your OTP for verification is ${otp}`;
                        var msg = urlencode(strmsg); 
                        var number = "91"+contact;
                        var apikey = process.env.TXT_LOCAL_API_KEY;
                        var sender='TXTLCL';
                        var data='apikey='+apikey+'&sender='+sender+'&numbers='+number+'&message='+msg
                        var options = {
                            host: 'api.textlocal.in',
                            path: '/send?'+data
                            };
                        callback = function(response) {
                            var str = '';
                            
                            //another chunk of data has been recieved, so append it to `str`
                            response.on('data', function (chunk) {
                            str = str + chunk;
                            });
                            //the whole response has been recieved, so we just print it out here
                            response.on('end', function () {
                            //console.log(str);
                            });
                        }                    
                         var response = http.request(options, callback).end();
                         

                        res.json({message:"An OTP has been sent to your registered mobile number !",status:"200"}).status(200);
                    }
                })
                .catch(err=>{
                    
                    res.json({error:err,status:"500"}).status(500);
                })
               
            }


        } catch (error) {
             next(error);
        }
    },
    //To verify and reset OTP
    otpVerification: async(req,res,next)=>{
        try {
            const {otp} = req.body;

            const findCustomer = await Customers.findOne({"otp":otp});
            if(!findCustomer)
            {

                return res.json({error:'Invalid OTP ! Please enter a valid OTP',status:"403"}).status(403);
            }

            Customers.updateOne({_id:findCustomer._id},{$set:{otp:findCustomer.otp,verified:"Verified"}})
            .then(result=>{
               
                console.log(result)
                if(result.ok === 1){
                    const token = JWT.sign({
                        iss:'NammaBadavane Customers',
                        sub:findCustomer._id,
                        iat:new Date().getTime(),
                        exp:new Date().setDate(new Date().getDate()+180) //current date & time + 12 months ahead
                    },process.env.JWT_LOCAL_SECRET)

                    res.json({message:"Your contact has been successfully verified !",token:token,id:findCustomer._id,status:"200"}).status(200);
                }
            })
            .catch(err=>{
                res.json({error:err,status:"500"}).status(500);
            })
           
           
            
        } catch (error) {
            next(error);
        }
    },
    //After OTP verification to complete profile once
    profileCompletion: async(req,res,next)=>{
        try {
            const findCustomer = await Customers.findOne({"_id":req.user.id});
            var profileLocation="null"; 
            if(req.file){
                var profileLocation = req.file.location;
            }
            if(findCustomer){
                Customers.updateOne({_id:findCustomer._id},{$set:{
                    name:req.body.name,
                    email:req.body.email,
                    profile:profileLocation,
                    address:req.body.address,
                    location:req.body.location,
                }})
                .then(result=>{
                  
                    if(result.ok === 1){                     
                       
                       return res.json({message:"Your profile has been successfully updated !",status:"200"}).status(200);
                    }
                })
                .catch(err=>{
                
                    res.json({error:err,status:"500"}).status(500);
                });
               

            }
            else{

                return res.json({"message":"No customer found ! Please try again later",status:"404"}).status(404);
            }
        } catch (error) {
            next(error);
        }
    },
    //Profile Update Route for users
    profileUpdate: async(req,res,next)=>{
        try {

            var profileLocation="null"; 
            if(req.file){
                var profileLocation = req.file.location;
            }
            const findCustomer = await Customers.findOne({"_id":req.user.id});
            
                if(findCustomer){      
                    const s3 = new aws.S3({
                        secretAccessKey: process.env.S3_SECRET,
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        region: process.env.S3_REGION,
                      });
                      var filenameToRemove = findCustomer.profile.split('/').slice(-1)[0];
                      const params = {
                          Bucket: process.env.S3_BUCKET,
                          Key: `customer-profiles/${filenameToRemove}`
                      };
                      s3.deleteObject(params, (error, data) => {
                        if (error) {
                          res.status(500).json({error:error,status:"500"});
                        }
                        else{
                            Customers.updateOne({_id:findCustomer._id},{$set:{
                                name:req.body.name,
                                email:req.body.email,
                                profile:profileLocation,
                                address:req.body.address,
                                location:req.body.location,
                            }})
                            .then(result=>{
                                if(result.ok === 1){      
                                return res.json({message:"Your profile has been successfully updated !",status:"200"}).status(200);
                                }
                            })
                            .catch(err=>{
                                res.json({error:err,status:"500"}).status(500);
                            });
                        }
                      
                      });
                     
                    
                    
                }
                else{ return res.json({"message":"No customer found ! Please try again later",status:"404"}).status(404); }
           

        } catch (error) {
            next(error);
        }
    },
    //To get user profile after authentication
    profile: async(req,res,next)=>{
        try {
            const findCustomer = await Customers.findOne({"_id":req.user.id});
            if(findCustomer){
                
                res.json({"data":{
                    "id":findCustomer._id,
                    "name":findCustomer.name,
                    "email":findCustomer.email,
                    "contact":findCustomer.contact,
                    "profile":findCustomer.profile,
                    "address":findCustomer.address,
                    "location":findCustomer.location,
                    "verified":findCustomer.verified,
                },status:"200"}).status(200);

            }
            else{
                res.json({"message":"No customer found ! Please try again later",status:"200"}).status(200);
            }
        } catch (error) {
            next(error);
        }
    },
}