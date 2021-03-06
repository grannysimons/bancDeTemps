const Messages = require('./messages');
const User = require('./models/user');
const Transaction = require('./models/transaction');
const Activity = require('./models/activity');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var MapboxClient = require('mapbox');
var mapbox = require('mapbox');
var geo = require('mapbox-geocoding');
var socket = require('socket.io-client')(process.env.PRODUCT_URL);
// var socket = require('socket.io-client')('http://localhost:3000');
// var mapbox = require('./mapbox-geocode.js');
// var mapBoxClient = new MapboxClient('pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw');
// geo.setAccessToken('pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw');

var mapBoxClient = new MapboxClient(process.env.MAPBOX_TOKEN);
geo.setAccessToken(process.env.MAPBOX_TOKEN);

// var deepPopulate = require('mongoose-deep-populate')(mongoose);
// PostSchema.plugin(deepPopulate, options /* more on options below */);

module.exports = {
  signUp: {
    retrieveData: (req, res, next) => {
      const {
        name, lastName, userName, passwordUser, repeatPassword, mail, telephone, introducing, roadType, roadName, number, zipCode, city, province, state,
      } = req.body;
    
      res.locals.userData = {
        name, lastName, userName, password: passwordUser, repeatPassword, mail, telephone, introducing, direction: {roadType, roadName, number, zipCode, city, province, state,},
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
          res.render('auth/signup', data);
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
      // if(req.session.currentUser) next();
      // else res.render('/');
      const currentUser = req.session.currentUser;
      User.findOne({userName : currentUser.userName})
      .then(user => {
        if(!user)
        {
          res.render('/');
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
      const { name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, profileImg} = res.locals.user;
      res.locals.userPrevData = { name, lastName, userName, password, repeatPassword, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, profileImg};
      if(!res.locals.userPrevData.profileImg || res.locals.userPrevData.profileImg === '') res.locals.userPrevData.profileImg = '/images/avatar.png';
      next();
    },
  },
  editProfile_post: {
    retrieveData: (req, res, next) => {
      // console.log('req.body: ', req.body);
      const { name, lastName, userName, passwordUser, repeatPassword, mail, roadType, roadName, number, zipCode, city, province, state, telephone, introducing } = req.body;
      res.locals.userData = { name, lastName, userName, mail, telephone, introducing, direction: { roadType, roadName, number, zipCode, city, province, state }, };
      if(passwordUser) res.locals.userData.password = passwordUser;
      if(repeatPassword) res.locals.userData.repeatPassword = repeatPassword;
      res.locals.messages = { passwordsAreDifferent: '' };
      next();
    },
    checkPassword: (req,res,next) => {
      // console.log('checkPassword!');
      if(res.locals.userData.password || res.locals.userData.repeatedPassword)
      {
        if(res.locals.userData.password===res.locals.userData.repeatPassword)
        {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(res.locals.userData.password, salt);
          res.locals.userData.password = hashedPassword;
          res.locals.userData.repeatedPassword = hashedPassword;
          res.locals.messages.passwordsAreDifferent='';
          // //-------------------------CODI INTRODUIT PER ALBERT-----------------------------------
          // // anem a posar les coordenades a la propietat LOCATION , fent el forward geocoding
          // const { roadName, number, zipCode, city, province, state } = res.locals.userData.direction;
          // const query = roadName + ' ' + address + ' ' + number + ',' + zipCode + ' ' + city + ',' + province + ',' + state; 
          // geo.geocode('mapbox.places', query, (err, geoData) => {
          // console.log('a punt per entrar a geoData');
          
          // if (geoData) {
          //     console.log('hem entrat a dins de geoData per obtenir les coordenades');
          //     console.log('el valor de geodata es:', geoData);
          //     let longitude = geoData.features[0].geometry.coordinates[0];
          //     let latitude = geoData.features[0].geometry.coordinates[1];
          //     const location = {
          //       type: 'Point',
          //       coordinates: [longitude,latitude]
          //     };
          //     res.locals.userData.location = location;
          //     console.log('les coordenades de la ubicacio del client son:', location);
              
          //   } else {
          //     console.log('hi ha hagut un error:',err);
          //   }
          // });

          // //-----------------------------------------------------------------------------------------


          User.update({userName: res.locals.userData.userName}, res.locals.userData)
          .then(user => {
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
    },
    getLocation: (req, res, next) => {
      // console.log('getLocation!!!');
      //-------------------------CODI INTRODUIT PER ALBERT-----------------------------------
          // anem a posar les coordenades a la propietat LOCATION , fent el forward geocoding
          const { roadType, roadName, number, zipCode, city, province, state } = res.locals.userData.direction;
          const query = roadType + ' ' + roadName + ' ' + number + ',' + zipCode + ' ' + city + ',' + province + ',' + state; 
          // console.log('query? ', query);
          geo.geocode('mapbox.places', query, (err, geoData) => {
          // console.log('a punt per entrar a geoData');
          
          if (geoData) {
              // console.log('hem entrat a dins de geoData per obtenir les coordenades');
              // console.log('el valor de geodata es:', geoData);
              let longitude = geoData.features[0].geometry.coordinates[0];
              let latitude = geoData.features[0].geometry.coordinates[1];
              const location = {
                type: 'Point',
                coordinates: [longitude,latitude]
              };
              res.locals.userData.location = location;
              // console.log('les coordenades de la ubicacio del client son:', location);
              next();
              
            } else {
              // console.log('hi ha hagut un error:',err);
              next(err);
            }
          });

          //-----------------------------------------------------------------------------------------
    },
  },
  activityManager: {
    getActivities: (req, res, next) => {
      const currentUser = req.session.currentUser;
      Activity.find({idUser: currentUser._id})
      .then(activities => {
        res.locals.offertedActivities = [];
        res.locals.demandedActivities = [];
        if(activities)
        {
          for(let i=0; i<activities.length; i++)
          {
            if(activities[i].type === 'offerted') res.locals.offertedActivities.push(activities[i]);
            else if(activities[i].type === 'demanded') res.locals.demandedActivities.push(activities[i]);
          }
        }
        next();
      })
      .catch(error => next(error))
    }
  },
  filter: {
    getUsers: (req, res, next) => {
      res.locals.activities = [];
      let filter = {};
      // console.log('el valor de req.query.distance es:',req.query.distance);
      if(req.query.long && req.query.lat)
      {

        filter.location = { $geoWithin:
          { $centerSphere: [ [ req.query.long, req.query.lat ], req.query.distance / 3963.2 ] } }; 

        // filter.location = {
        //   $nearSphere: {
        //     $geometry: {
        //       type: 'Point',
        //       coordinates: [req.query.long, req.query.lat],
        //     },
        //     $maxDistance: req.query.distance,
        //   },
        // };
      };
      // Let's check if there's some specific username, otherwise, we have to search for all of them
      if(req.query.userName) {
        filter.userName = req.query.userName;
        // console.log('el username que busquem es',filter.userName);
        User.findOne({userName: filter.userName})
      .then(users => {
        
        // var idUsers = [];
        // users.forEach(user => {
        //   idUsers.push(user._id);
        // });
        res.locals.idUsers = [users._id];
        // console.log('aquest es el array de users',res.locals.idUsers);
        next();
      })
      .catch(error => {
        next(error);
      });
      } else { 
        // console.log('Busquem tots els users que estan a dins una distancia determinada');
        filter.userName = '';
        User.find({ location:
          { $geoWithin:
             { $centerSphere: [ [ req.query.long, req.query.lat ], req.query.distance / 3963.2 ] } } })
        .then(users => {
  
        var idUsers = [];
        users.forEach(user => {
          idUsers.push(user._id);
        });
        res.locals.idUsers = idUsers;
        // console.log('aquest es el array de users',res.locals.idUsers);
        next();
      })
      .catch(error => {
        next(error);
      });
      }  
    },
    getActivities: (req, res, next) => {
      //-------------------CODI ALBERT: MIREM SI ESTEM AGAFANT LES ACTIVITATS D'UN SOL USER, O BÉ DE MES D'UN USER. I DESPRES FILTREM TAMBE PER SECTOR I SUBSECTOR
      
      let numberOfUsers = res.locals.idUsers.length;
      // console.log('el numero usuaris a mirar i agafar les activitats es:', numberOfUsers);
      // console.log('el valor de sector es:',req.query.sector);
      // console.log('el valor de subsector es:',req.query.subsector);
      let filter = {};
      switch (numberOfUsers) {
        case 0 :
          //aquest cas es quan no hi ha usuaris a prop de on estas ubicat;
          break;
        default :
          //aquest cas és quan hem fet la búsqueda d'un usuari en concret. Hem d'agafar les activitats d'aquest usuari
          //si filtrem per sector/subsector, nomes hem de mostrar les activitats del sector
          if (req.query.sector === '' && req.query.subsector === '') {
            filter = {
              idUser : {$in : res.locals.idUsers}};
          } else if (req.query.sector === '' ) {
            filter = {
              idUser : {$in : res.locals.idUsers},
              subsector : req.query.subsector,
            };
          } else {
            filter = {
              idUser : {$in : res.locals.idUsers},
              sector : req.query.sector
            };
          }

          Activity.find(filter)
          .populate('idUser')
          .then(activities => {
            res.locals.activities = activities;
            next();
           })
          .catch(error => {
          next(error);
          })
          // break;
        // default:
        //   let filterMany = {
        //     idUser : {$in : res.locals.idUsers},
        //     // sector : req.query.subsector,
        //     // subsector : req.query.subsector,
        //   };
        //   Activity.find(filterMany)
        //   .populate('idUser')
        //   .then(activities => {
        //     res.locals.activities = activities;
        //     next();
        //    })
        //   .catch(error => {
        //   next(error);
        //   })
       }
      // var filter = {$and: []};
      // if(res.locals.idUsers && res.locals.idUsers.length > 0) filter.$and.push({idUser: {$in: res.locals.idUsers}});
      // if(req.query.sector) filter.$and.push({sector: req.query.sector});
      // else if(req.query.subsector) filter.$and.push({subsector: req.query.subsector});
      
      // if(filter.$and.length === 0) filter = {}; 
      
      // Activity.find(filter)
      // .populate('idUser')
      // .then(activities => {
      //   res.locals.activities = activities;
      //   next();
      // })
      // .catch(error => {
      //   next(error);
      // })
      // console.log('les activitats son', res.locals.activities);
    }
  },
  startRequest: {
    getInvolvedUser: (req, res, next) => {
      res.locals.idActivity = req.params.idAct;
      Activity.findOne({_id: req.params.idAct})
      .then(activity => {
        if(activity)
        {
          res.locals.users = {};
          if(activity.type === 'offerted')
          {
            res.locals.users.offertingUser = activity.idUser;
            res.locals.users.demandingUser = req.session.currentUser._id;
          }
          else if(activity.type === 'demanded')
          {
            res.locals.users.demandingUser = activity.idUser;
            res.locals.users.offertingUser = req.session.currentUser._id;
          }
        }
        next();
      })
      .catch(error => {
        res.status(500);
        res.locals.message = "this activity corresponds to no user";
        res.json({ error: res.locals.message });
      });
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
          const error = `<div class="alert alert-warning" role="alert">
              Transaction already exists
            </div>`;
          res.json({ error });
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
  },


//-----------------------TRANSACTION MANAGER--------------------------------------------------------  
  TransactionManager: {
    getTransactions: (req, res, next) => {
      const currentUser = req.session.currentUser;
      let state = req.query.state;
      var aa = 'offertingUserId',
          bb = 'demandingUserId'
      
      switch (state) {
        case 'Pending' :
          state = 'Proposed';
          break;
        case 'Proposed' :
          aa = 'demandingUserId';
          bb = 'offertingUserId';
          break;
        default:
          
      }

      // Utilizando el [] en las variables, estamos usando la propiedad de Computed Variables de Javascript
      Transaction.find({[aa]: currentUser._id, state: state})
      .populate([{ 
          path: `${bb}`,
          populate: {
            path: 'offertedActivities',
          }},
        {path: 'idActivity'}])
        .then(adventure => {
        res.locals.transactions = adventure;
        next();
        })
        .catch(error => {
          next(error);
        })
     },
    getTransactionInfoSecondLeg: (req, res, next) => {
      const currentUser = req.session.currentUser;
      const transactionId = req.query.transactionId;
      Transaction.find({idTransactionsInvolved: transactionId})
      .populate([{ 
          path: 'demandingUserId',
          populate: {
            path: 'offertedActivities',
          }},
        {path: 'idActivity'}])
        .then(adventure => {
          // Nota: Ens retona un ARRAY d'objectes, per això fem adventure[0]
          let transactionId2 = adventure[0]._id;
          Transaction.find({_id: transactionId2})
          .populate([{ 
            path: 'offertingUserId',
            populate: {
              path: 'offertedActivities',
            }},
          {path: 'idActivity'}])
          .then(response => {
            res.locals.transactionSecondLeg = response;
            next();
          })
          .catch(error => {
            next(error);
          })
        }) 
        .catch(error => {
          next(error);
        })
    },
    getUserId: (req, res, next) => {
      const userName = req.query.userName;
      User.findOne({userName: userName})
      .then(user => {
        let userid = {userid: user._id}; 
        res.locals.userid = user._id;
        next();
      })
      .catch(error => {
        next(error);
      })
      next();
    },
    updateStatusTransaction: (req, res, next) => {
      let {state,transactionId} = req.query
      //we have to update the status
      let conditions = { _id: transactionId }
          , update = { state: state}
          , options = { multi: false };

      Transaction.update(conditions, update, options)
      .then(numAffected => {
        next();
      })
      .catch(error => {
        next(error);
      })
    }
  },
  // This middleware is called when searching for specific user activities from Transaction Manager search box, and we apply for transaction in specific activity
  insertNewTransaction: {
    insertTransaction: (req, res, next) => {
      const {offertingUserId,demandingUserId,activityId,status} = req.body;
      Transaction.create({
        idActivity: activityId,
        offertingUserId: offertingUserId,
        demandingUserId: demandingUserId,
        state: status,
      })
      .then(createdTransaction => {
        let transactionId = createdTransaction._id;
        res.locals.transactionId = transactionId;
        next(); // Desde la API farem el retorn a AXIOS, el retorn del res.json
      })
      .catch(error => next(error));
    },
    increaseCounterPendingTransactions: (req, res, next) => {
      const {offertingUserId,demandingUserId,activityId,status} = req.body;
      let conditions = { _id: offertingUserId }
          , update = { $inc: { 'numTransactions.pending': 1 }}
          , options = { multi: false };

      User.update(conditions, update, options)
      .then(numAffected => {
        User.findById(offertingUserId).select({ 'numTransactions.pending': 1, '_id': 1})
        .then (pendingTransactions => {
          const pendingNum = pendingTransactions;
          socket.emit('pending transaction', { my: offertingUserId });
        })
        .catch(error => {
          next(error);
        }) 
                
        // we send a socket message for Offerting User in order to show the message of number pending transactions
        // console.log('el numero de files update es:', numAffected);
        next();
      })
      .catch(error => {
        next(error);
      })

    }
    // updateUserTransactionArray: (req,res,next,transactionId) => {
    //   var {offertingUserId,demandingUserId,activityId,status} = req.body;
    //   User.findByIdAndUpdate({offertingUserId},{$push: {transactions: transactionId}})  
    //   .then(user => {
    //     next();
    //   })
    //   .catch(error => next(error));

    // }

    },
    // with acceptProposedTransaction we accept the transaction and we choose an activity from the user who is demanding our activity  
    acceptProposedTransaction: {
      getTransactionInfo: (req, res, next) => {
        const transactionId = req.query.transactionId;
        const activityId = req.query.activityId;
        Transaction.findOne({_id: transactionId})
            .then(transaction => {
              res.locals.transactionInfo = transaction;
              res.locals.activityId = activityId;
              next();
            })
            .catch(error => {
              next(error);
            })
        

      },
      insertSecondTransaction: (req, res, next) => {
        // const transactionId = req.query.transactionId;
        const activityId = req.query.activityId;
        let dataTransaction = new Transaction ({
          idActivity: activityId,
          offertingUserId: res.locals.transactionInfo.demandingUserId,
          demandingUserId: res.locals.transactionInfo.offertingUserId,
          state: 'Accepted',
          idTransactionsInvolved: res.locals.transactionInfo._id
        });

        //we use 'save' method because we get the _id we need to insert into the other transaction
        dataTransaction.save()
        .then(result => {
          res.locals.transactionIdSecondTransaction = result._id;
          next();
        })
        .catch(error => {
          next(error);
        })
    },
    updateFirstTransaction: (req, res, next) => {
      let transactionId1 = res.locals.transactionInfo._id
      let transactionId2 = res.locals.transactionIdSecondTransaction; 

      //we have to update first transaction with the transaction_id of second. So, they are related
      let conditions = { _id: transactionId1 }
          , update = { $set: {idTransactionsInvolved: transactionId2, state: 'Accepted'}}
          , options = { multi: false };

      Transaction.update(conditions, update, options)
      .then(numAffected => {
        next();
      })
      .catch(error => {
        next(error);
      })
    },
    getUserActivities: (req, res, next) => {
      const userId = req.query.userId;
      Activity.find({idUser: userId, type: 'offerted'})
      .then(response => {
        res.locals.activities = response;
        next();
      })
      .catch(error => {
        next(error);
      })
    }  
  },
  geoLocation: {
    inverseGeocoding: (req, res, next) => {
    next();

    },
    updateCoordinatesAllUsers: (req, res, next) => {
      User.find({location: { $exists: true }}).select({ 'direction': 1, 'location': 1, '_id': 1})
      // Buildings.find({ref_inmueble: refInmueble}).select({ 'latitude': 1, 'longitude': 1, '_id': 0})
      .then(response => {
        for (let i=0; i<response.length; i++ ) {
          const id = response[i]._id;
          const { roadType, roadName, number, zipCode, city, province, state } = response[i].direction;
          // const roadName = response[i].direction.roadName
          //       ,number = response[i].direction.number
          //       ,zipCode = response[i].direction.zipCode
          //       ,city = response[i].direction.city
          //       ,province = response[i].direction.province
          //       ,state = response[i].direction.state;

          const query = roadName + ' ' + number + ',' + zipCode + ' ' + city + ',' + province + ',' + state; 
          
          if (roadName != undefined) {
            geo.geocode('mapbox.places', query, (err, geoData) => {
           
          
          
          if (geoData) {
              let longitude = geoData.features[0].geometry.coordinates[0];
              let latitude = geoData.features[0].geometry.coordinates[1];
              const location = {
                type: 'Point',
                coordinates: [longitude,latitude]
              };
              let conditions = { _id: id }
                , update = { $set: {location: location}}
                , options = { multi: false };
  
              // Buildings.update(conditions, update, options)
              User.findOneAndUpdate(conditions, update, options)
              .then(numAffected => {
              })
              .catch(error => {
                next(error);
              })
              
            } else {
            }
          });
         
        }
      }
        next();
      })
    
      .catch(error => {
        next(error);
      })  
      
    }  
  }
}



