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
  telephone: String,
  introducing: String,
  location: {
    type: {type: String},
    coordinates: [Number],
  },
<<<<<<< HEAD
  numTransactions : {
    proposed: Number,
    pending: Number,
    accepted: Number,
    refused: Number,
    finished: Number,
    cancelled: Number
  }
=======
  profileImg: {type: String, default: '/images/avatar.png'},
>>>>>>> 4ffcd10dbbb53f9f536206407aa418adfc4a8666
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);

module.exports = User;