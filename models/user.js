const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id: Schema.Types.ObjectId,
  name: String,
  lastName: String,
  userName: String,
  password: String,
  mail: String,
  direction: {
    roadType: String,
    roadName: String,
    number: Number,
    zipCode: String,
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
    involvedUserId: Schema.Types.ObjectId,
    state: {
      state: String,
      enum: ['Proposed', 'Accepted', 'Refused', 'Cancelled', 'Finished']
    },
    idActivity: {
      type: Schema.Types.ObjectId, 
      ref: 'Activity',
    }
  }],
  offertedActivities: [{
    type: Schema.Types.ObjectId, 
    ref: 'Activity',
  }],
  demandedActivities: [{
    type: Schema.Types.ObjectId, 
    ref: 'Activity',
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;