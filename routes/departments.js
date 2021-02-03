const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-customer');
const DepartmentController = require('../controllers/departmentController');
const upload = require('../helpers/departmentFileUpload');


router.route('/').get(DepartmentController.getAllDepartments);

router.route('/:id').get(DepartmentController.getDepartment);

router.route('/register').post(passport.authenticate('jwt',{session:false}),upload.single("file"),DepartmentController.registerDepartment);

router.route('/update/:id').put(passport.authenticate('jwt',{session:false}),upload.single("file"),DepartmentController.updateDepartment);

// router.route('/delete').delete(passport.authenticate('jwt',{session:false}),DepartmentController.deleteDepartment);




module.exports = router;