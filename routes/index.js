const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Messages = require('../messages');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { error: {empty, userExist, userNotExist,errorMessage} } = require('../message');
const Middleware = require('../middlewares');

// const mongoose = require('./database');

//------------------To connect to localhost mongoDB----------------------------------
// const mongoose = require('mongoose');
// const dbName = 'timeBank';
// mongoose.connect(`mongodb://localhost/${dbName}`);

// ------------------To connect to remote mongoDB in mlab----------------------------------
const mongoose = require('mongoose');
const dbName2 = 'timebank';
mongoose.connect(`mongodb://administrator:timebank2018@ds145412.mlab.com:45412/${dbName2}`);



/* GET home page. */
router.get('/', function(req, res, next) {
// console.log(`el currentUser existeix?:${req.session.currentUser.userName}`);  
  

  if (req.session.currentUser) {
    // console.log(req.session);
    // console.log(`la sessió activa de usuari es: ${req.session.currentUser.userName}`);
    // console.log(`el _id de usuari és: ${req.session.currentUser._id}`);
    var data2;
    var userName = req.session.currentUser.userName;
    // we get the  transactions for the current logged user
    const user_id = req.session.currentUser._id;
    Transaction.find()
    .populate('offertingUserId')
    .populate('demandingUserId')
    .populate('idActivity')
    .then(transactions => {
      
      
      // console.log(`les transactions que passem a la vista son: ${transactions}`);
      
      data2 = {
          title: 'Express', 
          username: userName,
          transactions : transactions
          }
    //   console.log(`el valor de title es: ${data2.title}`);    
    //   console.log(`el valor de username es: ${data2.username}`);  
    //   console.log(`el valor de transaccions es: ${data2.transactions}`);  
      
      res.render('index', data2);
    })
    .catch(error => {
      console.log(error)
    });
  
  } else {res.render('index', { title: 'Express' });
      }

  
});

router.get('/transactions', Middleware.TransactionManager.getTransactions, (req, res, next) => {
    const userData = res.locals.transactions;
    const dataTransactions = {
        userData: userData
    };
    res.render('transactions',dataTransactions);
    

})

module.exports = router;
