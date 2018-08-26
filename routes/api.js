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
router.get('/getUserId', (req,res,next) => {
  const userName = req.query.userName;
  console.log('el nom passat es: ',userName); 
  User.findOne({userName: userName})
      .then(user => {
        let userid = user._id; 
        console.log('user: ', user);
        res.json({userid});
        next();
      })
      .catch(error => {
        next(error);
      })
});

router.get('/acceptSecondLegTransaction', Middleware.acceptProposedTransaction.getTransactionInfo,Middleware.acceptProposedTransaction.insertSecondTransaction,Middleware.acceptProposedTransaction.updateFirstTransaction, (req,res,next) => {
  console.log('Hem fet tots els passos per insertar la nova transacció');
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
  console.log('Hem fet tots els middlewares');

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



module.exports = router;