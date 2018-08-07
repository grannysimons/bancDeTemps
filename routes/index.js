const express = require('express');
const router = express.Router();
const User = require('../models/user');

const mongoose = require('mongoose');
const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  console.log('signup: ', req.body);
  const userData = { 
    name: req.body.name, 
    lastName: req.body.lastName, 
    userName: req.body.userName, 
    password: req.body.password, 
    mail: req.body.mail, 
    direction: 
    { roadType: req.body.roadType, 
      roadName: req.body.roadName, 
      number: req.body.number, 
      zip: req.body.zip, 
      city: req.body.city, 
      province: req.body.province, 
      state: req.body.state,
    }, 
    contactTel: req.body.contactTel, 
    personalIntroducing: req.body.personalIntroducing, 
    image: req.body.image, 
  };

  User.create(userData)
  .then(user => {
    console.log('usuari creat! ', user);
  })
  .catch(error => next(error));
  res.redirect('/');
});

module.exports = router;
