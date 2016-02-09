var express = require('express');
var router = express.Router();
var passport = require('passport');



// Add a GET /auth/linkedin route that takes a middleware argument of passport.authenticate('linkedin').
router.get('/auth/linkedin',
   passport.authenticate('linkedin'));


// In /logout, set req.session to null and redirect to /.
router.get('/auth/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

// The route should be a GET request to /auth/linkedin/callback that takes a middleware argument of passport.authenticate('linkedin', { failureRedirect: '/' }). Inside the route you will simply redirect to /.
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/'}), function(req, res, next) {
  res.redirect('/');
})

router.get('/auth/galvanize', function(req, res, next) {
  res.render('login/index')
})

router.post('/auth/galvanize', function(req, res, next) {
  validate.login(req.body).then(function(results) {
    if (user) {
      res.redirect('/index')
    } else {
      res.render('auth/index',
      {user_name: req.body.userName,
      password: req.body.password,
      errors: results.errors})
    }
  })
})

module.exports = router;
