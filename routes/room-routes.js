const express = require('express');

const RoomModel = require('../models/room-model.js');

const router = express.Router();


router.get('/rooms/new', (req, res, next) => {
    if (req.user) {
      res.render('room-views/new-room-view.ejs');
    }

    else {
      res.redirect('/login');
    }
});



const multer = require('multer');

const myUploader = multer({
    // "dest" (destination) is a multer setting
    // that specifies WHERE to put uploaded files
  dest: __dirname + '/../public/uploads/'
    // save uploaded files inside public/uploads/
});


router.post(
  '/rooms',
    // Use multer to process a SINGLE file upload from the input named "roomPhoto"
  myUploader.single('roomPhoto'),
     //                  |
     // <input name="roomPhoto">
  (req, res, next) => {
      // multer will create "req.file" that contains information about the upload
      console.log('');
      console.log('🗂 req.file (file upload from multer) 📷 ------------------');
      console.log(req.file);
      console.log('');

      const theRoom = new RoomModel({
        name: req.body.roomName,
        description: req.body.roomDescription,
        photoUrl: '/uploads/' + req.file.filename,
        hasGhosts: false,

        // Set the owner as the logged in user's database id
        owner: req.user._id
      });

      const coinFlip = Math.floor(Math.random() * 2);

      if (coinFlip === 1) {
        theRoom.hasGhosts = true;
      }

      theRoom.save((err) => {
          if (err) {
            next(err);
            return;
          }

          res.redirect('/my-rooms');
      });
  }
);


router.get('/my-rooms', (req, res, next) => {
    if (req.user === undefined) {
      res.redirect('/login');
      return;
    }

    RoomModel
      .find({ owner: req.user._id })
      .populate('owner')
      .exec((err, roomResults) => {
          if (err) {
            next(err);
            return;
          }

          res.locals.roomsAndStuff = roomResults;

          res.render('room-views/room-list-view.ejs');
      });
});


module.exports = router;
