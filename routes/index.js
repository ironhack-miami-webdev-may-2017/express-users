const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});


// We want this page to be viewed only by logged in people.
router.get('/special', (req, res, next) => {
    // Only render the special page if you are logged in.
    if (req.user) {
      res.render('special-secret-view.ejs');
    }

    // If not logged in, redirect to log in page.
    else {
      res.redirect('/login');
    }
});

module.exports = router;
