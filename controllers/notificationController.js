const Notifications = require('../models/notification');
const fetch = require('node-fetch');
require('dotenv').config();


module.exports = {
   
    //To get list of all solutions 
    getNotifications: async(req,res,next)=>{
        Notifications.find()
        .then(data=>{
            return res.json({data:data}).status(200);
        })
        .catch(err => {
            return res.json({
                message:"No records found in database",
                error:err
            }).status(404);
        })

    },
    //To get a particular solution
    getNotification:async(req,res,next)=>{
        const id = req.user._id
        var fcm_token = req.body.fcm_token;
        if(fcm_token){

            Notifications.findById({"_id":id})
            .then(data=>{
              if(data){
                var notification = {
                    'title': data.title,
                    'text': data.description
                }
                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_token
                }
    
                fetch('https://fcm.googleapis.com/fcm/send',{
                    'method':'POST',
                    'headers':{
                        'Authorization':'key='+process.env.FCM_AUTH_KEY,
                        'Content-Type':'application/json'
                    },
                    'body':JSON.stringify(notification_body)
                })
                .then(()=>{
                    return res.json({"message":"Notifications sent successfully !"}).status(200);
                })
                .catch(err=>{
                    return res.json({"error":err}).status(400);
                })
              }
             
            })
            .catch(err=>{
                return res.json({
                    message:"No records found in database",
                    error:err
                }).status(404);
            })
        }
        else{
            return res.json({"error":"No registration fcm token found !"}).status(404);
        }
       
    }
   
}