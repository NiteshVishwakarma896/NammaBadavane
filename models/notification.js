const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema =  new Schema({  
        admin_id:{
            type:Schema.Types.ObjectId,
            required:true
        },
        customer_id:{
            type:Schema.Types.ObjectId,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        created_at:{
            type: Date, 
            default: Date.now
        },
        updated_at:{
            type: Date, 
            default: Date.now
        }
    
   
});



const Notifications = mongoose.model('notifications',notificationSchema);

module.exports = Notifications;