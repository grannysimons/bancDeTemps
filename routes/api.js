const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const Middleware = require('../middlewares');

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