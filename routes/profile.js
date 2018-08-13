const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Middlewares = require('../middlewares');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/edit', Middlewares.editProfile_get.checkUserExists, Middlewares.editProfile_get.retrieveData, (req, res, next) => {
  const userPrevData = res.locals.userPrevData;
  res.render('profile/edit', { userPrevData });
});

router.post('/edit', Middlewares.editProfile_post.retrieveData, Middlewares.editProfile_post.checkPassword, function(req, res, next) {
  res.locals.messages.passwordsAreDifferent='';
  User.update({userName: res.locals.userData.userName}, res.locals.userData)
  .then(user => {
    console.log('user ' + res.locals.userData.userName + ' correctly updated: ', user);

    const data = {
      message: res.locals.messages,
      userData: res.locals.userData,
    };
    res.render('profile/edit', data);
  })
  .catch(error => next(error));
});

router.get('/activityManager', Middlewares.activityManager.getActivities, (req, res, next) => {
  console.log('activitiessssssss: ', data);
  const data = {
    offertedActivities: res.locals.offertedActivities,
    demandedActivities: res.locals.demandedActivities,
  }
  res.render('profile/activityManager', data);
});

module.exports = router;
