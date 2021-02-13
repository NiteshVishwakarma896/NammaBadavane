const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complainSchema =  new Schema({  
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
        contact:{
            type:Number,
            required:true
        },
        file:{
            type:String
        },
        email:{
            type:String,
            lowercase:true,
            required:true
        },
        location: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point']
            },
            coordinates: {
              type: [Number]
            }
        },
        department:{
            type:String,
            required:true
        },
        sub_department:{
            type:String,
            required:true
        },
        date_of_complain:{
            type:Date,
            default: Date.now
        },
        status:{
            type:String,
            default:"Processing"
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



const Complains = mongoose.model('complains',complainSchema);

module.exports = Complains;