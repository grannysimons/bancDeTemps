const express = require('express');
const router = express.Router();
const User = require('../models/user');
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

module.exports = router;