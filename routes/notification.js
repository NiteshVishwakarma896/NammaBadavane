const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-customer');
const NotificationController = require('../controllers/notificationController');


router.route('/').get(passport.authenticate('jwt-local',{session:false}),NotificationController.getNotification);




module.exports = router;