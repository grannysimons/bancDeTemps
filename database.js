const mongoose = require('mongoose');

// const dbName = 'timeBank';
// mongoose.connect(`mongodb://localhost/${dbName}`)
// const dbName2 = 'timebank';
// mongoose.connect(`mongodb://administrator:timebank2018@ds145412.mlab.com:45412/${dbName2}`)
mongoose.connect(process.env.MONGODB_URI) 
  .then(() => {
    // console.log('😀');
  })
  .catch(() => {
    // console.log('😔');
    mongoose.connection.close();
  })

  module.exports = mongoose;