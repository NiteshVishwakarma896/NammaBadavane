const Notifications = require('../models/notification');
const fetch = require('node-fetch');
require('dotenv').config();


module.exports = {
   
    //To get a particular solution
    getNotification:async(req,res,next)=>{
        const id = req.user._id;
        
        Notifications.find({"customer_id":id})
        .then(data=>{
            return res.json({
                data,
                status:"200"
            }).status(200);
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