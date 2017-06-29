const express = require('express');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model.js');


const router = express.Router();


router.get('/signup', (req, res, next) => {
    res.render('auth-views/signup-view.ejs');
});

router.post('/signup', (req, res, next) => {
    if (req.body.signupUsername === '' || req.body.signupPassword === '') {
      res.locals.messageForDumbUsers = 'Please provide both username and password.';

      res.render('auth-views/signup-view.ejs');
      return;
    }

    UserModel.findOne(
      { username: req.body.signupUsername },

      (err, userFromDb) => {
          if (userFromDb) {
            res.locals.messageForDumbUsers = 'Sorry but that username is taken.';

            res.render('auth-views/signup-view.ejs');
            return;
          }

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

              res.redirect('/');
          });
      }
    );
});


module.exports = router;
