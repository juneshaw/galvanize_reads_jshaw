var express = require('express')
var router = express.Router()
var db = require('../src/db.js')

router.get('/', function(req, res, next) {
  res.render('login')
})

module.exports = router;
