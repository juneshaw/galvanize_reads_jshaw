var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')

router.get('/', function(req, res, next) {
  db.Authors().then(function(authors) {
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      res.render('authors/index',
                {'authorsBooks': authorsBooks.authorsBooks})
    })
  })
});

router.get('/edit/:id', function(req, res, next) {
  db.authors(req.params.id).then(function(authors) {
    res.render('authors/edit', {'authors': authors})
  })
})

router.post('/edit/:id', function(req, res, next) {
  db.updateAuthor(req.body).then( function() {
    res.redirect('/authors/#authors_id')
  })
})

router.get('/new', function(req, res, next) {
  res.render('authors/new')
})

router.post('/new', function(req, res, next) {
  db.insertAuthor(req.body).then( function() {
    res.redirect('/authors')
  })
})

router.get('/delete/:id', function(req, res, next) {
  db.authors(req.params.id).then(function(authors) {
    res.render('authors/delete', {'authors': authors})
  })
})

//What should I do if they want to delete an author that is a contributor?
//Just remove the author from the book contributors?
//Or make it not selectable, but still shown as a contributor?
//What should the click through of the author show on an old book, though?

router.post('/delete/:id', function(req, res, next) {
  db.deleteAuthor(req.params.id).then(function() {
    res.redirect('/authors');
  })
})

router.get('/:id', function(req, res, next) {
  db.author(req.params.id).then(function(authors) {
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      console.log('got to the id link');
      res.render('authors/show',
                  {'author': authorsBooks.authorsBooks[0]})
    })
  })
})

module.exports = router;
