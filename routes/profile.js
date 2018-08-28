const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
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
    req.session.currentUser = res.locals.userData;
    console.log('current: ',req.session.currentUser);
    const data = {
      message: res.locals.messages,
      userData: res.locals.userData,
    };
    res.render('profile/edit', data);
  })
  .catch(error => next(error));
});

router.get('/activityManager', Middlewares.activityManager.getActivities, (req, res, next) => {
  const data = {
    offertedActivities: res.locals.offertedActivities,
    demandedActivities: res.locals.demandedActivities,
  }
  res.render('profile/activityManager', data);
});

router.post('/activityManager/:type', Middlewares.geoLocation.inverseGeocoding, (req, res, next) => {
  const type = req.params.type;
  const { sector, subsector, description, tags, duration } = req.body;
  const latitude = 41.617964;
  const longitude = 2.093541;
  Activity.create({
    sector,
    subsector,
    description,
    tags,
    duration,
    idUser: req.session.currentUser._id, 
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    type,
  })
  .then(activity => {
    res.redirect('/profile/activityManager');
  })
  .catch(error => {
    next(error);
  })
});

router.post('/activityManager/:idAct/delete', (req, res, next) => {
  Activity.findByIdAndRemove(req.params.idAct)
  .then(() => {
    res.redirect('/profile/activityManager');
  })
  .catch(error => {
    console.log(error);
    next(error);
  })
})

module.exports = router;
