const mongoose = require('mongoose');

const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`)
  .then(() => {
    console.log('😀');
  })
  .catch(() => {
    console.log('😔');
    mongoose.connection.close();
  })