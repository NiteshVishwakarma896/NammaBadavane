const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const adminSchema =  new Schema({
  
        name:{
            type:String,
        },
        email:{
            type:String,
            lowercase:true
        },
        contact:{
            type:Number,
        },
        profile:{
            type:String
        },       
        password:{
            type:String,
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

adminSchema.pre('save',async function(next){
    
    try {
        //Genreation of Salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password,salt);
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.isValidPassword = async function(newPassword){
    try {
        return await bcrypt.compare(newPassword,this.password);
    } catch (error) {
        throw new Error(error);
    }
}


const Administrator = mongoose.model('administrator',adminSchema);

module.exports = Administrator;