const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Messages = require('../messages');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  const messages = {
    userAlreadyExists: '',
    userInvalid: '',
    passwordsAreDifferent: '',
  };

  const username = req.body.userName;
  User.findOne({userName: username})
  .then(user => {
    const userData = { 
      name: req.body.name, 
      lastName: req.body.lastName, 
      userName: req.body.userName, 
      password: req.body.password,
      repeatedPassword: req.body.repeatPassword,
      mail: req.body.mail, 
      direction: 
      { roadType: req.body.roadType, 
        roadName: req.body.roadName, 
        number: req.body.number, 
        zipCode: req.body.zipCode, 
        city: req.body.city, 
        province: req.body.province, 
        state: req.body.state,
      }, 
      contactTel: req.body.contactTel, 
      personalIntroducing: req.body.personalIntroducing, 
      image: req.body.image, 
    };
    if(user)
    {
      messages.userAlreadyExists = Messages.signup.userAlreadyExists;
      const data = {
        message: messages,
        userData: userData,
      };
      console.log(data);
      res.render('signup', data);
    }
    else
    {
      console.log(userData.password);
      console.log(userData.repeatedPassword);
      if(userData.password != userData.repeatedPassword)
      {
        messages.passwordsAreDifferent = Messages.signup.passwordsAreDifferent;
        const data = {
          message: messages,
          userData: userData,
        };
        res.render('signup', data);
      }
      else
      {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        userData.password = hashedPassword;
        User.create(userData)
        .then(user => {
          res.redirect('/');
        })
      }
    }
  })

  
  .catch(error => next(error));
});

module.exports = router;
