const Departments = require('../models/departments');
const aws = require("aws-sdk");
require('dotenv').config();


module.exports = {
    //To register new department once
    registerDepartment: async(req,res,next)=>{
        try{
            var departmentImageLocation="null"; 
            if(req.file){
                var departmentImageLocation = req.file.location;
            }
            else{
                return res.json({error:"An image is required to register a department !"}).status(400);
            }
            const findDepartment = await Departments.findOne({"title":req.body.title});
            if(!findDepartment)
            {
                const department = new Departments({
                    title:  req.body.title,
                    description:    req.body.description,
                    file:  departmentImageLocation,
                    sub_department:  req.body.sub_department
                });
                
                const result = await department.save();
                
                if(!result){
                    
                    return res.json({error:"Sorry we are unable to add new department, please try again later !"}).status(500);
                }
                else{
                    return res.json({message:req.body.title+" has been created"}).status(201);
                   
                }
               
            }
            else
            {
                return res.json({error:"Department with this name already exist, please try again with diffrent name !"}).status(500);
            }
            
        } catch (error) {
            next(error);
        }
    },
   
    //To get list of all solutions 
    getAllDepartments: async(req,res,next)=>{
        Departments.find()
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
    getDepartment:async(req,res,next)=>{
        const id = req.params.id
        Departments.findOne({"_id":id})
        .then(data=>{
            return res.json({data:data}).status(200);
        })
        .catch(err=>{
            return res.json({
                message:"No records found in database",
                error:err
            }).status(404);
        })
    },
    //To Update Department details
    updateDepartment:async(req,res,next)=>{
        const id = req.params.id;
        var departmentImageLocation="null"; 
        if(req.file){
            var departmentImageLocation = req.file.location;
        }
        else{
            return res.json({error:"An image is required to update a department !"}).status(400);
        }
        const findDepartment = await Departments.findOne({"_id":id});
        if(findDepartment){      
            const s3 = new aws.S3({
                secretAccessKey: process.env.S3_SECRET,
                accessKeyId: process.env.S3_ACCESS_KEY,
                region: process.env.S3_REGION,
              });
              var filenameToRemove = findDepartment.file.split('/').slice(-1)[0];
              const params = {
                  Bucket: process.env.S3_BUCKET,
                  Key: `departments/${filenameToRemove}`
              };
              
              s3.deleteObject(params, (error, data) => {
                if (error) {
                  res.status(500).json({error:error});
                }
                else{
                    Departments.updateOne({_id:findDepartment._id},{$set:{
                        title:req.body.title,
                        description:req.body.description,
                        file:departmentImageLocation,
                        sub_department:req.body.sub_department,
                    }})
                    .then(result=>{
                        if(result.ok === 1){      
                        return res.json({message:"Your department has been successfully updated !"}).status(200);
                        }
                    })
                    .catch(err=>{
                        res.json({error:err}).status(500);
                    });
                }
                console.log("File has been deleted successfully");
                console.log(data);
              });
                     
            
            
        }
        else{ return res.json({"message":"No departments found ! Please try again later"}).status(404); }
    }
   
}