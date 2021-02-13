const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema =  new Schema({  
       
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
        sub_department:{
            type:[String],
        },       
        sub_department_kannada:{
            type:[String],
        },       
        status:{
            type:String,
            default:"Active"
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



const Departments = mongoose.model('departments',departmentSchema);

module.exports = Departments;