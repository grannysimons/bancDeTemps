const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id: ObjectId,
  name: String,
  lastName: String,
  userName: String,
  password: String,
  mail: String,
  direction: {
    type: String,
    name: String,
    number: Number,
    zip: String,
    city: String,
    province: String,
    state: String,
  },
  latitude: Number,
  longitude: Number,
  contactTel: String,
  personalIntroducing: String,
  image: String,
  ratingAvg: Number,
  userRatings: [{
    userId: String,
    rating: Number,
    review: String
  }],
  transactions: [{
    involvedUserId: String,
    state: {
      state: String,
      enum: ['Proposat', 'Acceptat', 'Rebutjat', 'Cancelat', 'Finalitzat']
    },
    idActivitat: String
  }],
  offertedActivities: [{
    type: ObjectId, 
    ref: 'Activity',
  }],
  demandedActivities: [{
    type: ObjectId, 
    ref: 'Activity',
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;