const Joi = require('@hapi/joi');

module.exports = {
    validateBody:(schema)=>{
        return(req,res,next)=>{
            const result = Joi.validate(req.body,schema);

            if (result.error) {                
                
                return res.json(result.error).status(400);
            }

            if (!req.value) {
                
                req.value ={};
            }
            req.value['body'] = result.value;
           
            next();
        }
    },

    //Schemas

    schemas:{
        signUpSchema: Joi.object().keys({
            contact:Joi.string().required()
        }),
        signInSchema:Joi.object().keys({
            contact: Joi.string().required(),
            otp: Joi.string().required()
        })
       
    }
}