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
});

const User = mongoose.model('User', userSchema);

module.exports = User;