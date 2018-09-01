const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Middleware = require('../middlewares');

router.get('/:idAct/request', Middleware.isLogged, Middleware.startRequest.getInvolvedUser, Middleware.startRequest.transactionExists, Middleware.startRequest.createTransaction, (req, res, next) => {
  console.log('request');
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
    console.log('error!!! ', error);
    res.status(500);
    res.json({ error });
  })

});

router.get('/filter', Middleware.filter.filterByUsername, Middleware.filter.filterBySectorSubsector, (req, res, next) => {
  const activitiesByUserSectorSubsector = res.locals.activitiesByUserSectorSubsector;
  const activitiesBySectorSubsector = res.locals.activitiesBySectorSubsector;

  if(activitiesByUserSectorSubsector && activitiesByUserSectorSubsector.length > 0)
  {
    activities = activitiesByUserSectorSubsector;
    res.status(200);
    res.json({ activities, currentUser: req.session.currentUser });
  }
  else if (activitiesBySectorSubsector && activitiesBySectorSubsector.length > 0)
  {
    activities = activitiesBySectorSubsector;
    res.status(200);
    res.json({ activities, currentUser: req.session.currentUser });
  }
  else if(activitiesByUserSectorSubsector || activitiesBySectorSubsector)
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

router.get('/filterUserActivities', Middleware.filter.filterByUsername, Middleware.filter.filterBySectorSubsector, (req, res, next) => {
  const activitiesByUserSectorSubsector = res.locals.activitiesByUserSectorSubsector;
  const activitiesBySectorSubsector = res.locals.activitiesBySectorSubsector;
  console.log('el valor de activities es:', activitiesByUserSectorSubsector);

  if(activitiesByUserSectorSubsector)
  {
    activities = activitiesByUserSectorSubsector;
    res.status(200);
    res.json({ activities, currentUser: req.session.currentUser });
  }
  
  else
  {
    res.status(500);
    res.json({ error });
  }
});



//-----------API ROUTES FOR TRANSACTION MANAGER----------------------------------


router.get('/filterUserActivitiesForTransactions', Middleware.acceptProposedTransaction.getUserActivities, (req,res,next) => {
  
  
  console.log('EL LLISTAT ACTIVITATS ES:',res.locals.activities);

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
  // const {state} = req.query;
  // console.log('ESTEM CONSULTANT LES TRANSACCIONS QUE TENEN ESTAT:',req.query);

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
  console.log('Hem fet tots els passos per recuperar les dades de la transaccio');
  let transactions = res.locals.transactions
  res.json({ transactions });
  
});

router.get('/updateStateTransaction', Middleware.TransactionManager.updateStatusTransaction, (req, res, next) => {
  console.log('Hem fet tots els passos per recuperar les dades de la transaccio');
  let transactions = res.locals.transactions
  res.json({ transactions });
  
});

router.get('/getTransactionInfoSecondLeg', Middleware.TransactionManager.getTransactionInfoSecondLeg, (req, res, next) => {
  console.log('Hem fet tots els passos per recuperar les dades del 2LEG transaccio');
  console.log('el valor de la resposta es:', res.locals.transactionSecondLeg);
  let transactions2 = res.locals.transactionSecondLeg;
  res.json({ transactions2 });
  
});

router.get('/obtenirUserID2', (req,res,next) => {
  console.log('2.HEM POGUT ACCEDIR AL MIDDLEWARE');
  // console.log('2.1 EL USER ID PASSAT A LOCALS ES:', res.locals);
  const userName = req.query.userName;
      console.log('el nom passat es BBBB: ',userName); 
      User.findOne({userName: userName})
      .then(user => {
        let userid = user._id; 
        console.log('EL USER ID QUE PASSEM A LOCALS ES: ', userid);
        // res.locals.userid = user._id;
        // console.log('EL VALOR GUARDAT A LOCALS DEL USER ID ES',res.locals);
        res.json({userid}); //amb aquest comando passem les dades que volem de resposta a AXIOS. Per agafarles, desde el main.js del browser sera: response.data.userid
        next();
      })
      .catch(error => {
        next(error);
      })
    })





module.exports = router;