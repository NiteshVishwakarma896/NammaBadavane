const Solutions = require('../models/solutions');
const Complains = require('../models/complains');
const Notifications = require('../models/notification');
require('dotenv').config();


module.exports = {
    //To register new solution once
    registerSolution: async(req,res,next)=>{
        try{
            var solutionImageLocation="null"; 
            if(req.file){
                var solutionImageLocation = req.file.location;
            }
            else{
                return res.json({error:"An image or video is required to provide a solution !",status:"400"}).status(400);
            }
            const findComplain = await Complains.findOne({"_id":req.body.complain_id});
            if(!findComplain)
            {
                return res.json({error:"Sorry we did not find the complain, please try again later !",status:"500"}).status(500);
            }
            else
            {
                console.log(array(req.body.location))
                const solution = new Solutions({
                    admin_id:req.user._id,
                    customer_id:req.body.customer_id,
                    complain_id:req.body.complain_id,
                    title:  req.body.title,
                    description:    req.body.description,
                    file:  solutionImageLocation,
                    location:  req.body.location,
                    department:  findComplain.department,
                    sub_department:  findComplain.sub_department
                });
                
                const result = await solution.save();
                
                if(!result){
                    
                    return res.json({error:"Sorry we are unable to process your solution, please try again later !",status:"500"}).status(500);
                }
                else{
                    Complains.updateOne({_id:findComplain._id},{$set:{
                        status:"Solved"
                    }})
                    .then(result=>{
                        if(result.ok === 1){    
                            const notification = new Notifications({
                                admin_id:req.user._id,
                                customer_id:req.body.customer_id,
                                title:  req.body.title,
                                description:    req.body.description,
                            });  
                            const checkStats = notification.save();
                            if(!checkStats){
                                return res.json({message:"Sorry we are unable to process your solution & unale to notify customer, please try again later !",status:"500"}).status(500);
                            }
                            else{
                                return res.json({message:"Your solution to the problem has been successfully solved",status:"201"}).status(201);
                            }
                        }
                    })
                    .catch(err=>{
                        res.json({error:err,status:"500"}).status(500);
                    });
                   
                }
            }
            
        } catch (error) {
            next(error);
        }
    },
   
    //To get list of all solutions 
    getAllSolutions: async(req,res,next)=>{
        Solutions.find()
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
    //To get a particular solution
    getSolution:async(req,res,next)=>{
        const id = req.params.id
        Solutions.findOne({"_id":id})
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
    //To get a particular solution
    getSolutionAll:async(req,res,next)=>{
        const id = req.user._id
        Solutions.find()
        .where('customer_id').equals(id)
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
    }
   
}