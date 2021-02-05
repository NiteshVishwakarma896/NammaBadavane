const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-customer');
const ComplainController = require('../controllers/complainController');
const upload = require('../helpers/complainFileUpload');


router.route('/').get(ComplainController.getAllComplains);


router.route('/all').get(passport.authenticate('jwt-local',{session:false}),ComplainController.getUserComplain);

router.route('/register').post(passport.authenticate('jwt-local',{session:false}),upload.single("file"),ComplainController.registerComplain);


router.route('/:id').get(ComplainController.getComplain);


module.exports = router;