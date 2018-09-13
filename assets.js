module.exports = {
  extend : (obj, src) => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  },
  avatarFilter : (req, file, cb) => {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    //check format
    switch(file.mimetype)
    {
      case 'image/jpeg':
        cb(null, true);
      break;
      case 'image/png':
        cb(null, true);
      break;
      default:
        cb(null, false);
      break;
    }


    // To reject this file pass `false`, like so:
    // cb(null, false)
   
    // To accept the file pass `true`, like so:
    // cb(null, true)
   
    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))
  }
};