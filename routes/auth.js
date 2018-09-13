const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Middlewares = require('../middlewares');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Transaction = require('../models/transaction');
const { error: {empty, userExist, userNotExist,errorMessage} } = require('../message');
const mongoose = require('mongoose');
const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`);

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', Middlewares.signUp.retrieveData, Middlewares.signUp.checkNewUser, Middlewares.signUp.checkValidPassword, function(req, res, next) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.passwordUser, salt);
  
  const userData = res.locals.userData;
  userData.password = hashedPassword;
  delete userData.repeatPassword;
  userData.location = {type: 'Point', coordinates: [0,0]};
  console.log('userData: ', userData);
  User.create(userData)
  .then(user => {
    console.log('user creat ok!');
    req.session.currentUser = user;
    res.redirect('/');
  })
  .catch(error => 
    {
      console.log('user creat ko!');
      next(error)
    });
});


/* POST login credentials. */
router.post('/login', (req,res,next) => {
    
  const {userName, password} = req.body;
  
  if(!userName || !password)
  {
      req.flash('info', empty);
      res.redirect('/');
  }
  else
  {   
      //Nota: Important, al fer el metode find sobre un objecte Schema de Mongoose, ens retorna un array d'objectes
      // Per tant, si existeix l'objecte, llavors agafem la primera posició de l'array
      User.findOne({ userName })
      .then((user) => {
          if(user)
          {   
              if(bcrypt.compareSync(password, user.password))
              {
                  req.session.currentUser = user;
                  res.redirect('/');
              }
              else
              {    
                  req.flash('info', errorMessage);
                  res.redirect('/');
              }
          }
          else
          {
              req.flash('info', usernotExist);
              res.redirect('/');
          }
      })
      .catch((error => {
          next(error);
      }))
  }
})

router.get('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
})


module.exports = router;