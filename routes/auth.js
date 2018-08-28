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

router.get('/obtenirUserID', (req,res,next) => {
  console.log('2.HEM POGUT ACCEDIR AL MIDDLEWARE');
  console.log('2.1 EL USER ID PASSAT A LOCALS ES:', res.locals);
  const userName = req.query.userName;
      console.log('el nom passat es BBBB: ',userName); 
      User.findOne({userName: userName})
      .then(user => {
        let userid = user._id; 
        console.log('EL USER ID QUE PASSEM A LOCALS ES: ', userid);
        res.locals.userid = user._id;
        console.log('EL VALOR GUARDAT A LOCALS DEL USER ID ES',res.locals);
        res.json({userid}); //amb aquest comando passem les dades que volem de resposta a AXIOS. Per agafarles, desde el main.js del browser sera: response.data.userid
        next();
      })
      .catch(error => {
        next(error);
      })
      
    
  // if (res.locals.userid) {
  //   let userid = res.locals.userid;
  //   res.json({userid});
  // } else {
  //   console.log('tenim un error, no tenim el userid');
  // }
  
})

module.exports = router;