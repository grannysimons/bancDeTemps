module.exports = {
  ensureLogin: (req, res,next) => {
      if(req.session.currentUser){
          next();
      }
      else
      {
          res.redirect('/auth/login');
      }
  }
}

// una altra forma de fer-ho amb una funcio

// function checkAuth(req, res, next) {
//   if (!req.session.user_id) {
//     res.send('You are not authorized to view this page');
//   } else {
//     next();
//   }
// }

// I després, ho posem a la ruta app.get, com un paràmetre mes del GET. No deixarà de ser un middleware, que el cridarà primer

// app.get('/my_secret_page', checkAuth, function (req, res) {
//   res.send('if you are viewing this page it means you are logged in');
// });

