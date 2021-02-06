const Feedbacks = require('../models/feedback');
require('dotenv').config();


module.exports = {
    registerFeedback:async(req,res,next)=>{
        try {
            const feedback = new Feedbacks({
                customer_id:req.user._id,
                description:    req.body.description,
                rating:  req.body.rating
            });
            const result = await feedback.save();
            if(!result){
                return res.json({error:"Sorry we are unable to process your feedback, please try again later !",status:"500"}).status(500);
            }
            else{
                return res.json({message:"Thanks for providing feedback !",status:"201"}).status(201);
            }
        } catch (error) {
            next(error);
        }
    },
    //To get list of all feedback 
    getFeedbacks: async(req,res,next)=>{
        Feedbacks.find()
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
    //To get a particular feedback
    getFeedback:async(req,res,next)=>{
        const id = req.params.id
        Feedbacks.findOne({"_id":id})
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
    
   
}