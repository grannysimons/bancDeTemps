const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  Id: Schema.Types.ObjectId,
  idActivity: {
    type: Schema.Types.ObjectId,
    reference: 'activity',
  },
  offertingUserId: {
    type: Schema.Types.ObjectId,
    reference: 'user',
  },
  demandingUserId: {
    type: Schema.Types.ObjectId,
    reference: 'user',
  },
  state: {
    type: String,
    enum: ['Proposed', 'Accepted', 'Refused', 'Cancelled', 'Finished'],
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;