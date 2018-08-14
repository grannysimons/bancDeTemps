const express = require('express');
const { error: {empty, userExist, userNotExist,errorMessage} } = require('../message');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const saltRounds = 10;

const router = express.Router();

// router.get('/login', (req,res) => {
//     const data = {
//         messages: req.flash('info'),
//     }
//     res.render('auth/login', data);
// })

/* POST login credentials. */
router.post('/login2', (req,res,next) => {
    const {userName, password} = req.body;
    if(!userName || !password)
    {
        console.log('no existeix el username i/o el password');
        req.flash('info', empty);
        // res.redirect('/auth/login');
        res.redirect('/');
    }
    else
    {
        User.find({ userName })
        .then((user) => {
            if(user)
            {
                if(bcrypt.compareSync(password, user.password))
                {
                    req.session.currentUser = user;
                    res.redirect('/');
                }
                else
                {
                    req.flash('info', errorMessage);
                    // res.redirect('/auth/login');
                    res.redirect('/');
                }
            }
            else
            {
                req.flash('info', usernotExist);
                // res.redirect('/auth/login');
                res.redirect('/');
            }
        })
        .catch((error => {
            next(error);
        }))
    }
})

router.post('/logout', (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('/');
})

module.exports = router;





// router.post("/login", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "" || password === "") {
//     res.render("auth/login", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     console.log('falta el username i/o el password');
//     return;
//   }

//   User.findOne({ "username": username }, (err, user) => {
//       if (err || !user) {
//         res.render("auth/login", {
//           errorMessage: "The username doesn't exist"
//         });
//         return;
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         res.render("auth/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   });
// });