const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-customer');
const FeedbackController = require('../controllers/feedbackController');


router.route('/new-feedback').post(passport.authenticate('jwt-local',{session:false}),FeedbackController.registerFeedback);
router.route('/').get(FeedbackController.getFeedbacks);
router.route('/:id').get(FeedbackController.getFeedback);



module.exports = router;