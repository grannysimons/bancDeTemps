const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Middlewares = require('../middlewares');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Transaction = require('../models/transaction');
const { error: {empty, userExist, userNotExist,errorMessage} } = require('../message');
// const mongoose = require('./database');

//------------------To connect to localhost mongoDB----------------------------------
// const mongoose = require('mongoose');
// const dbName = 'timeBank';
// mongoose.connect(`mongodb://localhost/${dbName}`);

// ------------------To connect to remote mongoDB in mlab----------------------------------
const mongoose = require('mongoose');
// const dbName2 = 'timebank';
// mongoose.connect(`mongodb://administrator:timebank2018@ds145412.mlab.com:45412/${dbName2}`);
mongoose.connect(process.env.MONGODB_URI) 

router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

router.post('/signup', Middlewares.signUp.retrieveData, Middlewares.signUp.checkNewUser, Middlewares.signUp.checkValidPassword, function(req, res, next) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.passwordUser, salt);
  
  const userData = res.locals.userData;
  userData.password = hashedPassword;
  delete userData.repeatPassword;
  userData.location = {type: 'Point', coordinates: [0,0]};
  User.create(userData)
  .then(user => {
    req.session.currentUser = user;
    res.redirect('/');
  })
  .catch(error => 
    {
      next(error)
    });
});


/* POST login credentials. */
router.post('/login', (req,res,next) => {
    
  const {userName, password} = req.body;
  
  if(!userName || !password)
  {
      req.flash('info', empty);  //Nota: el flash te sentit per passar missatges entre rutes. Entre middlewares passem la informació a través de res.locals, o posant un quart argument a la funció
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
                const message = {
                  state: 'success',
                  info: 'Login correct!!'
                };
                res.json({message});   
              }
              else
              {    
                const message = {
                  state: 'error',
                  info: 'Password is not correct'
                };
                res.json({message});    
              }
          }
          else
          {
            const message = {
              state: 'error',
              info: 'This user doesnt exist'
            };
            res.json({message});    
          }
      })
      .catch((error => {
        const message = {
          state: 'error',
          info: '500 error in server. Try again'
        };
        res.json({message});  
      }))
  }
})

router.get('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
})


module.exports = router;