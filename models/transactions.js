const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  Id: Schema.Types.ObjectId,
  idActivity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
  },
  offertingUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  demandingUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  state: {
    type: String,
    enum: ['Proposed', 'Accepted', 'Refused', 'Cancelled', 'Finished'],
  },
  idTransactionsInvolved: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;