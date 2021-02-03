const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solutionSchema =  new Schema({  
        customer_id:{
            type:Schema.Types.ObjectId,
            required:true
        }, 
        admin_id:{
            type:Schema.Types.ObjectId,
            required:true
        }, 
        complain_id:{
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
        file:{
            type:String
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
        date_of_solution:{
            type:Date,
            default: Date.now
        },
        status:{
            type:String,
            default:"Solved"
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



const Solutions = mongoose.model('solutions',solutionSchema);

module.exports = Solutions;