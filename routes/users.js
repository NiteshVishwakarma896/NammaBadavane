const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-customer');
const { validateBody ,schemas } = require('../helpers/routeHelpers');
const UserController = require('../controllers/userController');
const SolutionController = require('../controllers/solutionController');
const upload = require('../helpers/imageUpload');

router.route('/signup').post(validateBody(schemas.signUpSchema),UserController.signUp);

router.route('/signin').post(validateBody(schemas.signInSchema),passport.authenticate('local-customer',{session:false}),UserController.signIn);

router.route('/profile').get(passport.authenticate('jwt-local',{session:false}),UserController.profile);

router.route('/send-otp').post(UserController.sendOTP);

router.route('/otp-verification').post(UserController.otpVerification);

router.route('/profile-completion').post(upload.single("profile"),passport.authenticate('jwt-local',{session:false}),UserController.profileCompletion);

router.route('/profile-update').post(upload.single("profile"),passport.authenticate('jwt-local',{session:false}),UserController.profileUpdate);

router.route('/solution/all').get(passport.authenticate('jwt-local',{session:false}),SolutionController.getSolutionAll);


module.exports = router;