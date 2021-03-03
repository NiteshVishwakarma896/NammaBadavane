const Admins = require('../models/admin');
const Users = require('../models/customers');
const JWT =  require('jsonwebtoken');
const aws = require("aws-sdk");
require('dotenv').config();


module.exports = {
    //To register new admin once
    signUp: async(req,res,next)=>{
        try {
            const {email} = req.value.body; 
            var profileLocation="null"; 
            
            if(req.file){
                var profileLocation = req.file.location;
            }
           
            const findAdmin = await Admins.findOne({"email":email});
            if(findAdmin)
            {
                return res.json({error:'This email is already in use, please try with another email !',status:"403"}).status(403);
            }
            

            const admin = new Admins({                
                    name:req.body.name,           
                    email:req.body.email,           
                    contact:req.body.contact,           
                    profile:profileLocation,           
                    password:req.body.password,           
               
            });
           const result = await admin.save();
         
            
           if(result){   
            const token = JWT.sign({
                iss:'NammaBadavane Admins',
                sub:admin._id,
                iat:new Date().getTime(),
                exp:new Date().setDate(new Date().getDate()+1) //current date & time + 1 day ahead
            },process.env.JWT_ADMIN_SECRET)             
               return res.json({message:"A new adminstrator account has been created !",token:token,status:"201"}).status(201);
           }
           else{
                return res.json({"message":"Sorry we are unable to process request ! Please try again later",status:"500"}).status(500); 
           }
          


        } catch (error) {
            next(error);
        }
    },
    //To SignIn or Login 
    signIn: async(req,res,next)=>{
        try {
            const token = JWT.sign({
                iss:'NammaBadavane Admins',
                sub:req.user._id,
                iat:new Date().getTime(),
                exp:new Date().setDate(new Date().getDate()+1) //current date & time + 1 day ahead
            },process.env.JWT_ADMIN_SECRET)

            return res.json({message:"Successfully Signed In !",token:token,status:"200"}).status(200);    
              
        } catch (error) {
            next(error);
        }
    },
  
    //Profile Update Route for users
    profileUpdate: async(req,res,next)=>{
        try {
            console.log(req.file.location)
            var profileLocation="null"; 
            if(req.file){
                var profileLocation = req.file.location;
            }
            const findCustomer = await Admins.findOne({"_id":req.user.id});
            
                if(findCustomer){      
                    const s3 = new aws.S3({
                        secretAccessKey: process.env.S3_SECRET,
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        region: process.env.S3_REGION,
                      });
                      var filenameToRemove = findCustomer.profile.split('/').slice(-1)[0];
                      const params = {
                          Bucket: process.env.S3_BUCKET,
                          Key: `administrator/${filenameToRemove}`
                      };
                      
                      s3.deleteObject(params, (error, data) => {
                        if (error) {
                          res.status(500).json({error:error});
                        }
                        else{
                            Admins.updateOne({_id:findCustomer._id},{$set:{
                                name:req.body.name,
                                email:req.body.email,
                                profile:profileLocation,
                                contact:req.body.contact,
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
                else{ return res.json({"message":"No admin found ! Please try again later",status:"404"}).status(404); }
           

        } catch (error) {
            next(error);
        }
    },
    //To get user profile after authentication
    profile: async(req,res,next)=>{
        try {
            const findAdmin = await Admins.findOne({"_id":req.user.id});
            if(findAdmin){
                
                res.json({"data":
                    {
                    "name":findAdmin.name,
                    "email":findAdmin.email,
                    "contact":findAdmin.contact,
                    "profile":findAdmin.profile
                    },
                    status:"200"
                }).status(200);

            }
            else{
                res.json({"message":"No admin found ! Please try again later",status:"200"}).status(200);
            }
        } catch (error) {
            next(error);
        }
    },
    getAdmins: async(req,res,next)=>{
        try {
            Admins.find()
        .then(data=>{
            return res.json({data:data,status:"200"}).status(200);
        })
        .catch(err => {
            return res.json({
                message:"No records found in database",
                error:err,
                status:"404"
            }).status(404);
        })
        } catch (error) {
            next(error);
        }
    },
    getAdmin: async(req,res,next)=>{
        try {
            const id = req.params.id
            Admins.findOne({"_id":id})
            .then(data=>{
                return res.json({data:data,status:"200"}).status(200);
            })
            .catch(err=>{
                return res.json({
                    message:"No records found in database",
                    error:err,
                    status:"404"
                }).status(404);
            })
        
        } catch (error) {
            next(error);
        }
    },
    getUsers: async(req,res,next)=>{
        try {
            Users.find()
        .then(data=>{
            return res.json({data:data,status:"200"}).status(200);
        })
        .catch(err => {
            return res.json({
                message:"No records found in database",
                error:err,
                status:"404"
            }).status(404);
        })
        } catch (error) {
            next(error);
        }
    },
    getUser: async(req,res,next)=>{
        try {
            const id = req.params.id
            Users.findOne({"_id":id})
            .then(data=>{
                return res.json({data:data,status:"200"}).status(200);
            })
            .catch(err=>{
                return res.json({
                    message:"No records found in database",
                    error:err,
                    status:"404"
                }).status(404);
            })
        } catch (error) {
            next(error);
        }
    },
}