const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Middlewares = require('../middlewares');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', Middlewares.signUp.retrieveData, Middlewares.signUp.checkNewUser, Middlewares.signUp.checkValidPassword, function(req, res, next) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  
  const userData = res.locals.userData;
  userData.password = hashedPassword;
  User.create(userData)
  .then(user => {
    req.session.currentUser = user;
    res.redirect('/');
  })
  .catch(error => next(error));
});

module.exports = router;