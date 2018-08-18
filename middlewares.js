const Messages = require('./messages');
const User = require('./models/user');
const Transaction = require('./models/transaction');
const Activity = require('./models/activity');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  signUp: {
    retrieveData: (req, res, next) => {
      const {
        name, lastName, userName, password, repeatPassword, mail, telephone, introducing, roadType, roadName, number, zipCode, city, province, state,
      } = req.body;
    
      res.locals.userData = {
        name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: {roadType, roadName, number, zipCode, city, province, state,},
      }
      next();
    },
    checkNewUser: (req, res, next) => {
      res.locals.messages = { userAlreadyExists: '', userInvalid: '', passwordsAreDifferent: '', };
      User.findOne({userName: res.locals.userData.userName})
      .then(user => {
        if(user)
        {
          res.locals.messages.userAlreadyExists = Messages.signUp.userAlreadyExists;
          const data = {
            message: res.locals.messages,
            userData: res.locals.userData,
          };
          res.render('signup', data);
        }
        else
        {
          next();
        }
      });
    },
    checkValidPassword: (req, res, next) => {
      if(res.locals.userData.password != res.locals.userData.repeatPassword)
      {
        res.locals.messages.passwordsAreDifferent = Messages.signUp.passwordsAreDifferent;
        const data = {
          message: res.locals.messages,
          userData: res.locals.userData,
        };
        res.render('signup', data);
      }
      else
      {
        next();
      }
    }
  },
  editProfile_get: {
    checkUserExists: (req, res, next) => {
      // const currentUser = req.session.currentUser;
      const currentUser = 'usernameee';
      User.findOne({userName : currentUser})
      .then(user => {
        if(!user)
        {
          res.render('index', { title: 'Express' });
        }
        else
        {
          res.locals.user = user;
          next();
        }
      })
      .catch(error => next(error));
    },
    retrieveData: (req, res, next) => {
      const { name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, } = res.locals.user;
      res.locals.userPrevData = { name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, }
      next();
    },
  },
  editProfile_post: {
    retrieveData: (req, res, next) => {
      const { name, lastName, userName, password, repeatPassword, mail, roadType, roadName, number, zipCode, city, province, state, telephone, introducing } = req.body;
      res.locals.userData = { name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, };
      res.locals.messages = { passwordsAreDifferent: '' };
      next();
    },
    checkPassword: (req,res,next) => {
      if(res.locals.userData.password || res.locals.userData.repeatedPassword)
      {
        if(res.locals.userData.password===res.locals.userData.repeatPassword)
        {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(res.locals.userData.password, salt);
          res.locals.userData.password = hashedPassword;
          res.locals.userData.repeatedPassword = hashedPassword;
          res.locals.messages.passwordsAreDifferent='';
          User.update({userName: res.locals.data.userName}, res.locals.userData)
          .then(user => {
            // console.log('user ' + req.body.userName + ' correctly updated: ', user);
          })
          .catch(error => next(error));

          const data = {
            message: res.locals.messages,
            userData: res.locals.userData,
          };
          res.render('profile/edit', data);
        }
        else
        {
          res.locals.userData.password = res.locals.userData.password;
          res.locals.userData.repeatedPassword = res.locals.userData.repeatPassword;
          res.locals.messages.passwordsAreDifferent = Messages.editProfile.passwordsAreDifferent;
          const data = {
            message: res.locals.messages,
            userData: res.locals.userData,
          };
          res.render('profile/edit', data);
        }
      }
      next();
    }
  },
  activityManager: {
    getActivities: (req, res, next) => {
      const currentUser = req.session.currentUser;
      User.findOne({userName: currentUser.userName})
      .populate('offertedActivities')
      .populate('demandedActivities')
      .then(user => {
        res.locals.offertedActivities = user.offertedActivities;
        res.locals.demandedActivities = user.demandedActivities;
        next();
      })
      .catch(error => {
        next(error);
      })
    }
  },
  filter: {
    filterByUsername: (req, res, next) => {
      res.locals.activitiesByUserSectorSubsector = [];
      if(req.query.userName)
      {
        User.findOne({userName: req.query.userName})
        .populate('offertedActivities')
        .populate('demandedActivities')
        .then(user => {
          if(user)
          {
            if(user.offertedActivities)
            {
              for(let i=0; i<user.offertedActivities.length; i++)
              {
                if((req.query.sector === '' && req.query.subsector === '') || 
                ((user.offertedActivities[i].sector == req.query.sector) 
                  && (user.offertedActivities[i].subsector == req.query.subsector)) || 
                ((user.offertedActivities[i].sector == req.query.sector) 
                  && req.query.subsector === '' ) ||
                (req.query.sector === '' && (user.offertedActivities[i].subsector === req.query.subsector)))
                {
                  res.locals.activitiesByUserSectorSubsector.push(user.offertedActivities[i]);
                }
              }
            }
            if(user.demandedActivities)
            {
              for(let i=0; i<user.demandedActivities.length; i++)
              {
                if((req.query.sector === '' && req.query.subsector === '') || 
                (user.demandedActivities[i].sector === req.query.sector && user.demandedActivities[i].subsector === req.query.subsector) || 
                (user.demandedActivities[i].sector === req.query.sector && req.query.subsector === '' ) ||
                (req.query.sector === '' && user.demandedActivities[i].subsector === req.query.subsector))
                {
                  res.locals.activitiesByUserSectorSubsector.push(user.demandedActivities[i]);
                }
              }
            }
          }
          next();
        })
        .catch(error => next(error));
      }
      else
      {
        next();
      }
    },
    filterBySectorSubsector: (req, res, next) => {
      if(res.locals.activitiesByUserSectorSubsector && res.locals.activitiesByUserSectorSubsector.length > 0) next();
      else if(req.query.userName)
      {
        next();
      }
      else
      {
        res.locals.activitiesBySectorSubsector = [];
        const filter = {};
        if (req.query.sector) filter.sector = req.query.sector;
        if (req.query.subsector) filter.subsector = req.query.subsector;
        Activity.find( filter )
        .populate('idUser')
        .then(activities => {
          console.log(activities);
          for(let i=0; i<activities.length; i++)
          {
            res.locals.activitiesBySectorSubsector.push(activities[i]);
          }
          next();
        })
      }
    },
  },
  startRequest: {
    getInvolvedUser: (req, res, next) => {
      const idActivity = req.params.idAct;
      res.locals.idActivity = idActivity;
      User.findOne({offertedActivities: idActivity})
      .then((user) => {
        if(user)
        {
          res.locals.users = {
            offertingUser: user._id,
            demandingUser: req.session.currentUser._id,
          }
          next();
        }
        else
        {
          User.findOne({demandedActivities: idActivity})
          .then((user) => {
            if (user)
            {
              res.locals.users = {
                offertingUser: req.session.currentUser._id,
                demandingUser: user._id,
              };
              next();
            } 
            else
            {
              res.status(500);
              res.json({ error: "this activity corresponds to no user" });
            }
          })
        }
      })
    },
    transactionExists: (req, res, next) => {
      Transaction.findOne({
        idActivity: res.locals.idActivity,
        offertingUserId: res.locals.users.offertingUser,
        demandingUserId: res.locals.users.demandingUser ,
      })
      .then(transaction => {
        if(!transaction)
        {
          next();
        }
        else
        {
          res.status(500);
          res.json({ error: "transaction already exists"});
        }
      })
      .catch(error =>{
        // const error = new Error("fdsafass"
        // next(error)
        res.status(500);
        res.json({ error });
      })
    },
    createTransaction: (req, res, next) => {
      Transaction.create({
        idActivity: res.locals.idActivity,
        offertingUserId: res.locals.users.offertingUser,
        demandingUserId: res.locals.users.demandingUser,
        state: 'Proposed',
      })
      .then(createdTransaction => {
        res.locals.transactionId = createdTransaction._id;
        next();
      })
      .catch(error => {
        res.status(500);
        res.json({ error });
      })
    },
  },
  isLogged: (req, res, next) => {
    if(req.session.currentUser) next();
    else res.redirect('/');
  }
};
