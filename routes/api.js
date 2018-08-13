const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');

router.get('/:idAct/request', (req, res, next) => {
  // const user = req.session.currentUser;
  const userName = 'Uirpse';
  const idActivity = req.params.idAct;
  User.findOne({offertedActivities: idActivity})
  .then((user) => {
    if (user)
    {
      User.updateOne(
        { userName: userName }, 
        { $push: { transactions: { involvedUser: user._id, state: 'Proposed', idActivity: idActivity } } } )
      .then(userUpdate => {
        res.status(200);
        res.json({ userUpdate });
      })
      .catch((error) => {
        res.status(500);
        res.json({ error });
      })
    }
    else
    {
      res.status(500);
      res.json({ error });
    }
  })
  .catch((error) => {
    res.status(500);
    res.json({ error });
  })
});

router.get('/filter', (req, res, next) => {
  const filter = {};
  if (req.query.user) filter.user = req.query.user;
  if (req.query.sector) filter.sector = req.query.sector;
  if (req.query.subsector) filter.subsector = req.query.subsector;
  Activity.find(filter)
  .then(activities => {
    res.status(200);
    res.json({ activities });
  })
  .catch(error => {
    res.status(500);
    res.json({ error });
  });
});

module.exports = router;