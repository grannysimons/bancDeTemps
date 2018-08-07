const mongoose = require('mongoose');
const Schema = mongoose.Schema;

activitySchema = new Schema({
  id: Schema.Types.ObjectId,
  sector: String,
  subsector: String,
  description: String,
  tags: [String],
  imatges: [String],
  timetable: [{
    day: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6]
    },
    timeSlot: {
      type: Number,
      enum: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]
    }
  }],
  duration: Number,
  ratingAvg: Number,
  ratingActivity:[{
    userServer:{
      idUserConsummer: Schema.Types.ObjectId,
      rating: Number,
      review: String
    },
    userConsumer:{
      idUserServer: Schema.Types.ObjectId,
      rating: Number,
      review: String
    }
  }],
});


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;