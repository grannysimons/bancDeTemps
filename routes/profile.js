const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const Middlewares = require('../middlewares');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw' });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/edit', Middlewares.editProfile_get.checkUserExists, Middlewares.editProfile_get.retrieveData, (req, res, next) => {
  const userPrevData = res.locals.userPrevData;
  res.render('profile/edit', { userPrevData });
});

router.post('/edit', Middlewares.editProfile_post.retrieveData, Middlewares.editProfile_post.checkPassword, function(req, res, next) {
  
  console.log('edit');
  const roadType = req.body.roadType;
  const roadName = req.body.roadName;
  const number = req.body.number;
  const zipCode = req.body.zipCode;
  const city = req.body.city;
  const province = req.body.province;
  const state = req.body.state;
  const query = roadType + ' ' + roadName + ' ' + number + ', ' + zipCode + ' ' + city + ', ' + province + ', ' + state;
  geocodingClient.forwardGeocode({
    query: query,
    limit: 2
  })
  .send()
  .then(response => {
    const match = response.body;
    if(match)
    {
      var maxCoincidence = undefined;
      match.features.forEach(coincidence => {
        if(!maxCoincidence || maxCoincidence.relevance < coincidence.relevance) maxCoincidence = coincidence;
      });
      
      if(maxCoincidence)
      {
        res.locals.userData.location = maxCoincidence.center;
      }
      res.locals.messages.passwordsAreDifferent='';
      console.log('data', res.locals.userData);
      User.update({userName: res.locals.userData.userName}, res.locals.userData)
      .then(user => {
        req.session.currentUser = res.locals.userData;
        const data = {
          message: res.locals.messages,
          userData: res.locals.userData,
        };
        res.render('profile/edit', data);
      })
      .catch(error => {
        console.log(error);
        next(error);
      });
    }
  })
  .catch(error => {
    console.log(error);
  })
});

router.get('/activityManager', Middlewares.activityManager.getActivities, (req, res, next) => {
  const data = {
    offertedActivities: res.locals.offertedActivities,
    demandedActivities: res.locals.demandedActivities,
  }
  res.render('profile/activityManager', data);
});

router.post('/activityManager/:type', Middlewares.geoLocation.inverseGeocoding, (req, res, next) => {
  console.log('crear activittat');
  const type = req.params.type;
  const { sector, subsector, description, tags, duration } = req.body;
  Activity.create({
    sector,
    subsector,
    description,
    tags,
    duration,
    idUser: req.session.currentUser._id, 
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
