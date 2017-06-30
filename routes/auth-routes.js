const express = require('express');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model.js');


const router = express.Router();


// REGISTRATION ----------------------------------------------------------------
router.get('/signup', (req, res, next) => {
    res.render('auth-views/signup-view.ejs');
});

router.post('/signup', (req, res, next) => {
    // Check if username or password are empty.
    if (req.body.signupUsername === '' || req.body.signupPassword === '') {
      // If either of them is, display an error to the user
      res.locals.messageForDumbUsers = 'Please provide both username and password.';

      res.render('auth-views/signup-view.ejs');
      return;
    }

    // Otherwise check to see if the submitted username is taken.
    UserModel.findOne(
      { username: req.body.signupUsername },

      (err, userFromDb) => {
          if (err) {
            next(err);
            return;
          }

          // If the username is not taken, the "userFromDb" variable will be empty.

          // Check if "userFromDb" is not empty
          if (userFromDb) {
            // If that's the case, display an error to the user.
            res.locals.messageForDumbUsers = 'Sorry but that username is taken.';

            res.render('auth-views/signup-view.ejs');
            return;
          }

          // If we get here, we are ready to save the new user in the DB.
          const salt = bcrypt.genSaltSync(10);
          const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new UserModel({
            fullName: req.body.signupFullName,
            username: req.body.signupUsername,
            encryptedPassword: scrambledPassword
          });

          theUser.save((err) => {
              if (err) {
                next(err);
                return;
              }

              // Redirect to home if registration is SUCCESSFUL
              res.redirect('/');
          });
      }
    );
});
// END REGISTRATION ------------------------------------------------------------



const passport = require('passport');

// LOG IN ----------------------------------------------------------------------
router.get('/login', (req, res, next) => {
    res.render('auth-views/login-view.ejs');
});

router.post('/login',
  passport.authenticate(
      'local',  // 1st argument -> name of the strategy
                //                 (determined by the strategy's npm package)
      {         // 2nd argument -> settings object
        successRedirect: '/',     // "successRedirect" (where to go if login worked)
        failureRedirect: '/login' // "failureRedirect" (where to go if login failed)
      }
  )
);
// END LOG IN ------------------------------------------------------------------



router.get('/logout', (req, res, next) => {
    // the "req.logout()" function is defined by the passport middleware (app.js)
    req.logout();
    res.redirect('/');
});



module.exports = router;
