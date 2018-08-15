const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const Transaction = require('../models/transaction');
const Middleware = require('../middlewares');

router.get('/:idAct/request', Middleware.startRequest.getInvolvedUser, Middleware.startRequest.transactionExists, Middleware.startRequest.createTransaction, (req, res, next) => {
  User.updateOne(
    { _id: res.locals.users.offertingUser }, 
    { $push: { transactions: res.locals.transactionId } } )
  .then(updatedOffertingUser => {
    User.updateOne(
      { _id: res.locals.users.demandingUser }, 
      { $push: { transactions: res.locals.transactionId } } )
    .then(updatedDemandingUser => {
      console.log('updatedDemandingUser: ',updatedDemandingUser);
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
  console.log('aaaaa');
  const activitiesByUserSectorSubsector = res.locals.activitiesByUserSectorSubsector;
  const activitiesBySectorSubsector = res.locals.activitiesBySectorSubsector;

  console.log(res.locals.activitiesByUserSectorSubsector);
  console.log(res.locals.activitiesBySectorSubsector);

  if(activitiesByUserSectorSubsector && activitiesByUserSectorSubsector.length > 0)
  {
    activities = activitiesByUserSectorSubsector;
    res.status(200);
    res.json({ activities });
  }
  else if (activitiesBySectorSubsector && activitiesBySectorSubsector.length > 0)
  {
    activities = activitiesBySectorSubsector;
    res.status(200);
    res.json({ activities });
  }
  else if(activitiesByUserSectorSubsector || activitiesBySectorSubsector)
  {
    res.status(200);
    res.json({ message: "no results to show" });
  }
  else
  {
    console.log('3');
    res.status(500);
    res.json({ error });
  }
});

module.exports = router;