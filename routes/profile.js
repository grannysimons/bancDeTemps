const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Messages = require('../messages');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/edit', function(req, res, next) {

  // const user = req.session.currentUser;
  const user = 'roca';
  User.findOne({userName : user})
  .then(user => {
    if(!user)
    {
      res.render('/', {message: 'you are not logged in'});
    }
    else
    {
      console.log(user);
      const userPrevData = { 
        name: user.name, 
        lastName: user.lastName, 
        userName: user.userName, 
        password: user.password,
        repeatedPassword: user.repeatPassword,
        mail: user.mail, 
        direction: 
        { roadType: user.direction.roadType, 
          roadName: user.direction.roadName, 
          number: user.direction.number, 
          zipCode: user.direction.zipCode, 
          city: user.direction.city, 
          province: user.direction.province, 
          state: user.direction.state,
        }, 
        contactTel: user.contactTel, 
        personalIntroducing: user.personalIntroducing, 
        image: user.image, 
      };
      res.render('profile/edit', { userPrevData });
    }
  })
});

router.post('/edit', function(req, res, next) {
  const messages = {
    passwordsAreDifferent: '',
  };
  const userData = { 
    name: req.body.name, 
    lastName: req.body.lastName, 
    userName: req.body.userName, 
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
  if(req.body.password || req.body.repeatedPassword)
  {
    if(req.body.password===req.body.repeatPassword)
    {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      userData.password = hashedPassword;
      userData.repeatedPassword = hashedPassword;
      messages.passwordsAreDifferent='';
      User.update({userName: req.body.userName}, userData)
      .then(user => {
        console.log('user ' + req.body.userName + ' correctly updated: ', user);
      })
      .catch(error => next(error));

      const data = {
        message: messages,
        userData: userData,
      };
      res.render('profile/edit', data);
    }
    else
    {
      userData.password = req.body.password;
      userData.repeatedPassword = req.body.repeatPassword;
      messages.passwordsAreDifferent = Messages.editProfile.passwordsAreDifferent;
      const data = {
        message: messages,
        userData: userData,
      };
      res.render('profile/edit', data);
    }
  }
  else
  {
    messages.passwordsAreDifferent='';
    User.update({userName: req.body.userName}, userData)
    .then(user => {
      console.log('user ' + req.body.userName + ' correctly updated: ', user);
    })
    .catch(error => next(error));

    const data = {
      message: messages,
      userData: userData,
    };
    res.render('profile/edit', data);
  }
});


module.exports = router;
