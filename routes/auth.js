var express = require('express');
var router = express.Router();
var passport = require('passport');
var validate = require('../src/validation');
var db = require('../src/db')
var bcrypt = require('bcrypt')

// Add a GET /auth/linkedin route that takes a middleware argument of passport.authenticate('linkedin').
router.get('/linkedin',
   passport.authenticate('linkedin'));


// In /logout, set req.session to null and redirect to /.
router.get('/logout', function(req, res, next) {
  req.session = null;
  res.clearCookie("user");
  res.redirect('/');
});

// The route should be a GET request to /auth/linkedin/callback that takes a middleware argument of passport.authenticate('linkedin', { failureRedirect: '/' }). Inside the route you will simply redirect to /.
router.get('/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/'}), function(req, res, next) {
  res.cookie("user", req.user.username);
  db.user(req.user.username).first().then(function(results) {
    if (results) {
      res.cookie("role", results.role);
    } else {
      db.insertUser({"user_name": req.user.username,
                    "passwordHash": "",
                    "role": "normal"}).then(function(results) {
        res.cookie("role", "normal");
      });
    }
    res.redirect('/');
  })
})

router.get('/galvanize', function(req, res, next) {
  res.render('auth/index',
            {'userName': '',
            'passwordHash': '',
            'errors': []})
})

router.post('/galvanize', function(req, res, next) {
  db.users().where('user_name', req.body.userName).first().then(function(result){
    if (result) {
       if (bcrypt.compareSync(req.body.password, found.password)) {
         res.cookie("user", req.body.email, {secure:true});
         res.redirect("/");
       } else {
         res.redirect("/auth/index");
       }
     } else {
     res.redirect("/auth/index");
   }
  })
});
  // var valPromise = validate.login(req.body);
  // valPromise.then(function(results) {
  //   console.log('user results: ', results, 'req.body', req.body);
  //   if (req.user) {
  //   res.render('auth/index',
  //               {'userName': req.body.userName,
  //               'password': req.body.password,
  //               'errors': results.errors});
  //   } else {
  //     res.render('auth/index',
  //     {'userName': req.body.userName,
  //     'password': req.body.password,
  //     'errors': results.errors});
  //   }

  // })
  //   console.log('no such user');
  //   if (user) {
  //     res.redirect('/index')
  //   } else {
  //     res.redirect('/index')
      // res.render('auth/index',
      // {user_name: req.body.userName,
      // password: req.body.password,
      // errors: results.errors})
    // }
  // })
// })

module.exports = router;
