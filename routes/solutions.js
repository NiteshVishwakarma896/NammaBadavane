const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../helpers/passport-admin');
const SolutionController = require('../controllers/solutionController');
const upload = require('../helpers/solutionFileUpload');


router.route('/').get(SolutionController.getAllSolutions);

router.route('/:id').get(SolutionController.getSolution);

router.route('/register').post(passport.authenticate('jwt',{session:false}),upload.single("file"),SolutionController.registerSolution);




module.exports = router;