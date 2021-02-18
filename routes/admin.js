const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-admin');
const { validateBody ,schemas } = require('../helpers/adminRouteHelpers');
const AdminController = require('../controllers/AdminController');
const upload = require('../helpers/adminFileUpload');

router.route('/signup').post(upload.single("profile"),validateBody(schemas.signUpSchema),AdminController.signUp);

router.route('/signin').post(validateBody(schemas.signInSchema),passport.authenticate('local',{session:false}),AdminController.signIn);

router.route('/profile').get(passport.authenticate('jwt',{session:false}),AdminController.profile);

router.route('/profile-update').post(upload.single("profile"),passport.authenticate('jwt',{session:false}),AdminController.profileUpdate);

router.route('/admins').get(passport.authenticate('jwt',{session:false}),AdminController.getAdmins);

router.route('/users').get(passport.authenticate('jwt',{session:false}),AdminController.getUsers);

router.route('/admins/:id').get(passport.authenticate('jwt',{session:false}),AdminController.getAdmin);

router.route('/users/:id').get(passport.authenticate('jwt',{session:false}),AdminController.getUser);


module.exports = router;