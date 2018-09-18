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
const dbName2 = 'timebank';
mongoose.connect(`mongodb://administrator:timebank2018@ds145412.mlab.com:45412/${dbName2}`);

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
  console.log('el username es',userName);
  console.log('el password es',password);
  
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
                console.log('estem a 1');  
                req.session.currentUser = user;
                const message = {
                  state: 'success',
                  info: 'Login correct!!'
                };
                res.json({message});   
                // res.redirect('/');
              }
              else
              {    
                const message = {
                  state: 'error',
                  info: 'Password is not correct'
                };
                res.json({message});    
                // req.flash('info', errorMessage);
                // res.redirect('/');
              }
          }
          else
          {
            const message = {
              state: 'error',
              info: 'This user doesnt exist'
            };
            res.json({message});    
            // req.flash('info', usernotExist);
            //   res.redirect('/');
          }
      })
      .catch((error => {
        const message = {
          state: 'error',
          info: '500 error in server. Try again'
        };
        res.json({message});  
        // next(error);
      }))
  }
})

router.get('/logout', (req, res, next) => {
  console.log('no hem entrat al logout');
  delete req.session.currentUser;
  res.redirect('/');
})


module.exports = router;