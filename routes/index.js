const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/transactions.js');
const Messages = require('../messages');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { error: {empty, userExist, userNotExist,errorMessage} } = require('../message');

const mongoose = require('mongoose');
const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`);

/* GET home page. */
router.get('/', function(req, res, next) {
// console.log(`el currentUser existeix?:${req.session.currentUser[0].userName}`);  
  

  if (req.session.currentUser) {
    console.log(req.session);
    console.log(`la sessió activa de usuari es: ${req.session.currentUser[0].userName}`);
    console.log(`el _id de usuari és: ${req.session.currentUser[0]._id}`);
    var data2;
    var userName = req.session.currentUser[0].userName;
    // we get the  transactions for the current logged user
    const user_id = req.session.currentUser[0]._id;
    Transaction.find()
    .populate('offertingUserId')
    .populate('demandingUserId')
    .then(transactions => {
      
      
      // console.log(`les transactions que passem a la vista son: ${transactions}`);
      
      data2 = {
          title: 'Express', 
          username: userName,
          transactions : transactions
          }
      console.log(`el valor de title es: ${data2.title}`);    
      console.log(`el valor de username es: ${data2.username}`);  
      console.log(`el valor de transaccions es: ${data2.transactions}`);  
      
      res.render('index', data2);
    })
    .catch(error => {
      console.log(error)
    });
  
  } else {res.render('index', { title: 'Express' });
      }

  
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

/* POST login credentials. */
router.post('/login', (req,res,next) => {
    
    const {userName, password} = req.body;
    console.log('hem entrat a la ruta del login');
    console.log(`el username es: ${userName}`);
    console.log(`el password es: ${password}`);
    if(!userName || !password)
    {
        console.log('no existeix el username i/o el password');
        req.flash('info', empty);
        // res.redirect('/auth/login');
        res.redirect('/');
    }
    else
    {   
        //Nota: Important, al fer el metode find sobre un objecte Schema de Mongoose, ens retorna un array d'objectes
        // Per tant, si existeix l'objecte, llavors agafem la primera posició de l'array
        User.find({ userName })
        .then((user) => {
            if(user)
            {   
                console.log(user[0]); 
                console.log(user[0].lastName);
                console.log(user[0].userName);
                console.log(user[0].mail);
                console.log('hem passat user.find'); 
                console.log(`el password entrat per usuari és: ${password}`);
                console.log(`el password de la BBDD és: ${user[0].password}`);
                if(bcrypt.compareSync(password, user[0].password))
                {
                    req.session.currentUser = user;
                    res.redirect('/');
                }
                else
                {    console.log('estem dins else, el password no es correcte');
                    req.flash('info', errorMessage);
                    // res.redirect('/auth/login');
                    res.redirect('/');
                }
            }
            else
            {
                console.log(`usuari ${userName} no existeix`);
                req.flash('info', usernotExist);
                // res.redirect('/auth/login');
                res.redirect('/');
            }
        })
        .catch((error => {
            next(error);
        }))
    }
})

router.get('/logout', (req, res, next) => {
  console.log('hem entrat al logout');  
  delete req.session.currentUser;
  res.redirect('/');
})

module.exports = router;
