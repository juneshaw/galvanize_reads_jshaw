var express = require('express')
var router = express.Router()
var db = require('../src/db.js')

router.get('/login/linkedin', function(req, res, next) {
  res.render('login/linkedin');
});

router.get('/login/galvanize', function(req, res, next) {
  res.render('login/galvanize');
});

module.exports = router;
