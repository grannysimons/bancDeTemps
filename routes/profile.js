const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const Middlewares = require('../middlewares');
const Assets = require('../assets');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw' });
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploadImages/avatars/');
  },
  filename: function (req, file, cb) {
    let extension = '.jpg';
    if(file.mimetype === 'image/png') extension = '.png';

    cb(null, req.body.userName + extension);
  }
})

// const upload = multer({ dest: storage, fileFilter: Assets.avatarFilter });
const upload = multer({ storage });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/edit', Middlewares.editProfile_get.checkUserExists, Middlewares.editProfile_get.retrieveData, (req, res, next) => {
  const userPrevData = res.locals.userPrevData;
  res.render('profile/edit', { userPrevData });
});

router.post('/edit', upload.single('avatar'), Middlewares.editProfile_post.retrieveData, Middlewares.editProfile_post.checkPassword, Middlewares.editProfile_post.getLocation, function(req, res, next) {
  console.log("req.file: ", req.file);

  const roadType = req.body.roadType;
  const roadName = req.body.roadName;
  const number = req.body.number;
  const zipCode = req.body.zipCode;
  const city = req.body.city;
  const province = req.body.province;
  const state = req.body.state;
  const query = roadType + ' ' + roadName + ' ' + number + ', ' + zipCode + ' ' + city + ', ' + province + ', ' + state;
  // geocodingClient.forwardGeocode({
  //   query: query,
  //   limit: 2
  // })
  // .send()
  // .then(response => {
  //   const match = response.body;
  //   if(match)
  //   {
  //     var maxCoincidence = undefined;
  //     match.features.forEach(coincidence => {
  //       if(!maxCoincidence || maxCoincidence.relevance < coincidence.relevance) maxCoincidence = coincidence;
  //     });
      
  //     if(maxCoincidence)
  //     {
  //       res.locals.userData.location = {type: "Point", coordinates: maxCoincidence.center};
  //     }
  //     res.locals.messages.passwordsAreDifferent='';
  //     res.locals.userData.profileImg = (req.file && req.file.filename) ? '/images/uploadImages/avatars/'+req.file.filename : '/images/avatar.png';
  //     console.log('profileImg ',res.locals.userData.profileImg);
  //     User.update({userName: res.locals.userData.userName}, res.locals.userData)
  //     .then(user => {
  //       req.session.currentUser = Assets.extend(req.session.currentUser, res.locals.userData);
  //       const data = {
  //         message: res.locals.messages,
  //         userData: res.locals.userData,
  //         // avatarURL: req.locals.userData.profileImg,
  //       };
  //       res.render('profile/edit', data);
  //     })
  //     .catch(error => {
  //       next(error);
  //     });
  //   }
  // })
  // .catch(error => {
  //   console.log('editProfile error: ',error);
  // })
  res.locals.messages.passwordsAreDifferent='';
  res.locals.userData.profileImg = (req.file && req.file.filename) ? '/images/uploadImages/avatars/'+req.file.filename : '/images/avatar.png';
  console.log('profileImg ',res.locals.userData.profileImg);
  User.update({userName: res.locals.userData.userName}, res.locals.userData)
  .then(user => {
    req.session.currentUser = Assets.extend(req.session.currentUser, res.locals.userData);
    const data = {
      message: res.locals.messages,
      userData: res.locals.userData,
      // avatarURL: req.locals.userData.profileImg,
    };
    res.render('profile/edit', data);
  })
  .catch(error => {
    next(error);
  });
});

router.get('/activityManager', Middlewares.activityManager.getActivities, (req, res, next) => {
  const data = {
    offertedActivities: res.locals.offertedActivities,
    demandedActivities: res.locals.demandedActivities,
  }
  res.render('managers/activityManager', data);
});

router.post('/activityManager/:type', Middlewares.geoLocation.inverseGeocoding, (req, res, next) => {
  const type = req.params.type;
  const { sector, subsector, description, tags, duration } = req.body;
  const activityCreate = {
    sector,
    subsector,
    description,
    tags,
    duration,
    idUser: req.session.currentUser._id, 
    type,
  };
  Activity.create(activityCreate)
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
    next(error);
  })
})

module.exports = router;
