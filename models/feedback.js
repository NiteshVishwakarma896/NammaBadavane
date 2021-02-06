const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema =  new Schema({     
        customer_id:{
            type:Schema.Types.ObjectId,
            required:true
        },
        description:{
            type:String,
        },
        rating:{
            type:Number,
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



const Feedbacks = mongoose.model('feedbacks',feedbackSchema);

module.exports = Feedbacks;