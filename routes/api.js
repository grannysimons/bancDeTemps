const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Middleware = require('../middlewares');

router.get('/:idAct/request', Middleware.isLogged, Middleware.startRequest.getInvolvedUser, Middleware.startRequest.transactionExists, Middleware.startRequest.createTransaction, (req, res, next) => {
  User.updateOne(
    { _id: res.locals.users.offertingUser }, 
    { $push: { transactions: res.locals.transactionId } } )
  .then(updatedOffertingUser => {
    User.updateOne(
      { _id: res.locals.users.demandingUser }, 
      { $push: { transactions: res.locals.transactionId } } )
    .then(updatedDemandingUser => {
      res.status(200);
      res.json({ message: 'ok' });
    })
  })
  .catch(error => {
    res.status(500);
    res.json({ error });
  })

});

router.get('/filter', Middleware.filter.getUsers, Middleware.filter.getActivities, (req, res, next) => {
  const activities = res.locals.activities;
  if(activities && activities.length > 0)
  {
    res.status(200);
    res.json({ activities, currentUser: req.session.currentUser });
  }
  else if(activities.length === 0)
  {
    res.status(200);
    res.json({ message: "no results to show" });
  }
  else
  {
    res.status(500);
    res.json({ error });
  }
});

//-----------API ROUTES FOR TRANSACTION MANAGER----------------------------------

router.get('/filterUserActivitiesForTransactions', Middleware.acceptProposedTransaction.getUserActivities, (req,res,next) => {
  if (res.locals.activities) {
    const activities = res.locals.activities;
    res.json({activities,currentUser: req.session.currentUser}); // retornem a AXIOS el transactionId2. Si ho passa bé, ensenyem missatge que s'ha creat be la transacció
    res.status(200);
  } else {
    res.status(500);
    res.json({ error });
  }
  
});

router.get('/acceptSecondLegTransaction', Middleware.acceptProposedTransaction.getTransactionInfo,Middleware.acceptProposedTransaction.insertSecondTransaction,Middleware.acceptProposedTransaction.updateFirstTransaction, (req,res,next) => {
  if (res.locals.transactionIdSecondTransaction) {
    const transactionId2 = res.locals.transactionIdSecondTransaction;
    res.json({transactionId2}); // retornem a AXIOS el transactionId2. Si ho passa bé, ensenyem missatge que s'ha creat be la transacció
  } else {
    res.status(500);
    res.json({ error });
  }
  
});

router.post('/insertNewTransaction',Middleware.insertNewTransaction.insertTransaction, (req, res, next) => { 
  // Mirem a veure si s'ha retornat bé del ultim Middleware, i s'ha creat la segona transacció
  if (res.locals.transactionId) {
    const transactionId = res.locals.transactionId;
    res.json({transactionId}); // retornem a AXIOS el transactionId2. Si ho passa bé, ensenyem missatge que s'ha creat be la transacció
  } else {
    res.status(500);
    res.json({ error });
  }
  
  // En l'ultim middleware hem passat ja la informació de retorn a AXIOS, res.json({})
  

});


router.get('/getTransactionsOnState', Middleware.TransactionManager.getTransactions, (req, res, next) => {
  let transactions = res.locals.transactions
  res.json({ transactions });
  
});

router.get('/updateStateTransaction', Middleware.TransactionManager.updateStatusTransaction, (req, res, next) => {
  let transactions = res.locals.transactions
  res.json({ transactions });
  
});

router.get('/getTransactionInfoSecondLeg', Middleware.TransactionManager.getTransactionInfoSecondLeg, (req, res, next) => {
  let transactions2 = res.locals.transactionSecondLeg;
  res.json({ transactions2 });
  
});

router.get('/obtenirUserID2', (req,res,next) => {
  const userName = req.query.userName;
      User.findOne({userName: userName})
      .then(user => {
        let userid = user._id; 
        res.json({userid}); 
      })
      .catch(error => {
        next(error);
      })
    })





module.exports = router;