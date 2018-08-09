const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');


// GET /api/:userName/showOffertedActivities
// GET /api/:userName/showDemandedActivities
// GET /api/:userName/showPendingTransactions
// GET /api/:userName/showFinishedTransactions

router.get('/:idAct/request', (req, res, next) => {
  // const user = req.session.currentUser;
  const userName = 'roca';
  const idActivity = req.params.idAct;
  User.findOne({offertedActivities: idActivity})
  .then((user) => {
    if (user)
    {
      User.updateOne({userName: userName}, {transactions: {involvedUser: user._id, state: 'Proposed', idActivity: idActivity}})
      .then(userUpdate => {
        res.status(500);
        res.json({ error });
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
  if (req.query.sector) filter.sector = req.query.sector;
  if (req.query.subsector) filter.subsector = req.query.subsector;
  if (req.query.distance) filter.distance = req.query.distance;

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

// router.get('/:userName/showOffertedActivities', (req, res, next) => {
//   const userName = req.params.userName;
//   console.log(userName);
//   User.find({userName: userName}, {offertedActivities: 1, _id: 0})
//   .populate('offertedActivities')
//   .then(users => {
//     res.status(200);
//     res.json({ users });
//   })
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   });
// });

//pagination in groups of 5
// router.get('/:userName/showOffertedActivities/pagination_right/:page', (req, res, next) => {
//   const userName = req.params.userName;
//   const page = req.params.page;
//   const from = 5*(page-1);
//   const to = 5*page;
//   User.find({userName: userName}, {offertedActivities: 1, _id: 0})
//   .populate('offertedActivities')
//   .then(users => {
//     res.status(200);
//     res.json({ users });
//   })
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   });
// });

// router.get('/:userName/showDemandedActivities', (req, res, next) => {
//   const userName = req.params.userName;
//   User.find({userName: userName}, {demandedActivities: 1, _id: 0})
//   .populate('demandedActivities')
//   .then(users => {
//     res.status(200);
//     res.json({ users });
//   })
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   });
// });

// router.get('/:userName/showPendingTransactions', (req, res, next) => {
//   const userName = req.params.userName;
//   User.find({ userName: userName, 'transactions.state': 'Proposed' }, { transactions: 1, _id: 0 })
//   .then(users => {
//     console.log('users: ', users);
//     res.status(200);
//     res.json({ users });
//   })
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   });
// });

// router.get('/:userName/showFinishedTransactions', (req, res, next) => {
//   const userName = req.params.userName;
//   User.find({ userName: userName, 'transactions.state': 'Finished' }, { transactions: 1, _id: 0 })
//   .then(users => {
//     console.log('users: ', users);
//     res.status(200);
//     res.json({ users });
//   })
//   .catch(error => {
//     res.status(500);
//     res.json({ error });
//   });
// });


module.exports = router;