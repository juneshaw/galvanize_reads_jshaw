var express = require('express')
var router = express.Router()
var db = require('../src/db.js')

router.get('/auth/linkedin', function(req, res, next) {
  res.render('auth/linkedin');
});

router.get('/auth/galvanize', function(req, res, next) {
  res.render('auth/galvanize',
            {'errors': []});
});

module.exports = router;
