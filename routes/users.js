var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var bcrypt = require('bcrypt')


/* GET users listing. */
router.post('/', function(req, res, next) {
  var crypted = bcrypt.hashSync(req.body.password, 8);
  Users().insert({email:req.body.email, password:crypted}).then(function(val){
    res.redirect("/tickets");
  });
});

router.post('/login', function(req, res, next) {
    Users().where({email: req.body.email}).first().then(function(found){
       if (found){
         if bcrypt.compareSync(req.body.password, found.password) {
         res.cookie("user", req.body.email, {secure:true});
         //or httpOnly:true
         // or sign your cookies in app.js add a string to cookieparser:
         // app.use(cookieparser("sometext"));
         //AND res.cookie..., {sign:true}
         // then change all req.cookie.user all
         // occurrences to req.signed
         res.redirect("/tickets");
       } else {
         res.redirect("/no_auth");
       }
     } else {
       res.redirect("/no_auth");
     }
    })
});

router.get('/', function(req, res, next) {
  Users.select().then(function(users){
    res.render("users/index", {users: users});
  });
});

module.exports = router;
