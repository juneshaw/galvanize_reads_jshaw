var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')

router.get('/', function(req, res, next) {
  console.log('made it through the get above the render');
  var bookAuthorPromise = validation.booksAndAuthors();
  console.log('assigned the promise');
  bookAuthorPromise.then(function(booksAuthors) {
    console.log('!!!!!the promised books: ', booksAuthors);
    res.render('books/index',
              {'booksAuthors': booksAuthors.booksAuthors})
  })
})

router.get('/edit/#id', function(req, res, next) {
  db.book(req.params.id).then(function(book) {
    res.render('books/edit', {'book': book})
  })
})

router.post('/edit/#id', function(req, res, next) {
  db.updateBook(req.body).then( function() {
    res.redirect('/books/#book_id')
  })
})

router.get('/new', function(req, res, next) {
  res.render('books/new')
})

router.post('/new', function(req, res, next) {
  db.insertBook(req.body).then(function(book_id) {
    req.body.authors.forEach(function(author) {
      db.insertBookContributors({'book_id': book_id,
                                'author_id': author.id}).then(function() {
        res.redirect('/books')
      })
    })
  })
})

router.get('/delete/:id', function(req, res, next) {
  db.book(req.params.id).then(function(book) {
    res.render('books/delete', {'book': book})
  })
})

router.post('/delete/:id', function(req, res, next) {
  db.deleteBook(req.params.id).then(function(book) {
    res.redirect('/books');
  })
})

router.get('/#id', function(req, res, next) {
  db.book(req.params.id).then(function(book) {
    res.render('books/book', {'book': book})
  })
})

module.exports = router;
