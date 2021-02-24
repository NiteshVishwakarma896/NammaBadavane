const Complains = require('../models/complains');
require('dotenv').config();
module.exports = {
    //To register new complain once
    registerComplain: async(req,res,next)=>{
        try{
            var complainImageLocation=null; 
            if(req.file){
                var complainImageLocation = req.file.location;
            }
            const complain = new Complains({
                customer_id:req.user._id,
                title:  req.body.title,
                description:    req.body.description,
                contact:  req.body.contact,
                file:  complainImageLocation,
                email:  req.body.email,
                location:  req.body.location,
                department:  req.body.department,
                sub_department:  req.body.sub_department
            });
            const result = await complain.save();
            if(!result){
                return res.json({error:"Sorry we are unable to process your complain, please try again later !",status:"500"}).status(500);
            }
            else{
                return res.json({message:"Your complain has been successfully registered & in progress",status:"201"}).status(201);
            }
        } catch (error) {
            next(error);
        }
    },
    //To get list of all complains 
    getAllComplains: async(req,res,next)=>{
        
        Complains.find()
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

    },
    //To get a particular complain
    getComplain:async(req,res,next)=>{
        const id = req.params.id
        Complains.findOne({"_id":id})
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
    },
    getUserComplain:async(req,res,next)=>{

        const id = req.user._id

        Complains.find()
        .where('customer_id').equals(id)
        .then(data=>{
            return res.json({data:data,status:"200"}).status(200);
        })
        .catch(err=>{
            console.log(err)
            return res.json({
                message:"No records found in database",
                error:err,
                status:"Error In data Fetching"
            }).status(404);
        })
    },
   
}