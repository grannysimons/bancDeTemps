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
  if (req.session.currentUser) {
    var data2;
    var userName = req.session.currentUser.userName;
    // we get the  transactions for the current logged user
    const user_id = req.session.currentUser._id;
    Transaction.find()
    .populate('offertingUserId')
    .populate('demandingUserId')
    .populate('idActivity')
    .then(transactions => {
      data2 = {
          title: 'Express', 
          username: userName,
          transactions : transactions
          }
      res.render('index', data2);
    })
    .catch(error => {
    });
  
  } else {res.render('index', { title: 'Express' });
      }

  
});

router.get('/transactions', Middleware.TransactionManager.getTransactions, (req, res, next) => {
    const userData = res.locals.transactions;
    const dataTransactions = {
        userData: userData
    };
    res.render('managers/transactionManager',dataTransactions);
    

})

router.get('/updatecoordinates', Middleware.geoLocation.updateCoordinatesAllUsers, (req, res, next) => {
  res.redirect('/');
})

module.exports = router;
