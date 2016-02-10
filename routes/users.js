var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var db = require('../src/db')
var bcrypt = require('bcrypt')


/* GET users listing. */
router.post('/', function(req, res, next) {
  var crypted = bcrypt.hashSync(req.body.password, 8);
  db.users().insert({'email':req.body.email, 'passwordHash':crypted, 'role':'normal'}).then(function(val){
    res.cookie("user", req.body.email, {secure:true});
    res.redirect("/");
  });
});

router.post('/login', function(req, res, next) {
  db.users().where('user_name' req.body.userName}).first().then(function(results){
     if (results){
       if bcrypt.compareSync(req.body.password, found.password) {
         res.cookie("user", req.body.email, {secure:true});
         res.cookie("role", results.role, {secure:true});
         res.redirect("/");
       } else {
         res.redirect("/auth/index");
       }
     } else {
     res.redirect("/auth/index");
   }
  })
});

router.get('/', function(req, res, next) {
  Users.select().then(function(users){
    res.render("users/index", {users: users});
  });
});

module.exports = router;
