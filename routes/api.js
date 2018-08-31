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

// Because we check for the userName in order to get user._id, we should index the User collection by userName
router.get('/getUserId2', (req,res,next) => {
  console.log("hem accedit per tal d'obtenir el userId");
  const userName = req.query.userName;
  console.log('el nom passat es BBBB: ',userName); 
  User.findOne({userName: userName})
      .then(user => {
        let userid = user._id; 
        res.json({userid});
        next();
      })
      .catch(error => {
        next(error);
      })
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
  

  // const transactionId = req.query.transactionId;
  // console.log('el transactionId passat es: ',transactionId); 
  // Transaction.findOne({_id: transactionId})
  //     .then(transaction => {
  //       res.json({transactionId});
  //       next();
  //     })
  //     .catch(error => {
  //       next(error);
  //     })
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

// router.post('/insertNewTransaction',(req,res,next) => {
//   var {offertingUserId,demandingUserId,activityId,status} = req.body;
//   console.log('hem entrat al POST per crear la transacció!!!');
//   console.log(offertingUserId,demandingUserId,activityId,status);
//   Transaction.create({
//     idActivity: activityId,
//     offertingUserId: offertingUserId,
//     demandingUserId: demandingUserId,
//     state: status,
//   })
//   .then(createdTransaction => {
   
//     let transactionId = createdTransaction._id;
//     console.log('hem creat la transaccio. El transaction_id es:',transactionId);
//     console.log('hem creat la transaccio. El offertingUser_id es:',offertingUserId);
    
//     User.findById({offertingUserId})  
//     .then(user => {
//       var transactionsArray = user.transactions.push(transactionId);
//       User.findByIdAndUpdate(offertingUserId, {transactions: transactionsArray})
//       .then(user => {
//         console.log('actualitzat be');
//       }) 
//       .catch(error => {next(error)});
      
//       }) 
      
    
//     .catch(error => {next(error)});
   
//   })

   
      

  
    
  
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   })

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