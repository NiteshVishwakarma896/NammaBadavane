const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema =  new Schema({
   
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
        address:{
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
        otp:{
            type:String,
            unique:true
        },
        verified:{
            type:String,
            default:"Not Verified"
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

// userSchema.pre('save',async function(next){    
//     try{
//         //Genreation of Salt
//         const otp = otpGenerator.generate(6, { upperCase: true, specialChars: false });
//         this.otp = otp;        
//         next();

//     } catch (error) {
//         next(error);
//     }
// });

userSchema.methods.isValidOTP = async function(otp){
    try {
        
        if(otp === this.otp){
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
}


const Customers = mongoose.model('customers',userSchema);

module.exports = Customers;