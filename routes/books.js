var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')

router.get('/', function(req, res, next) {
  db.Books().then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthors(books);
    bookAuthorPromise.then(function(booksAuthors) {
      res.render('books/index',
                {'booksAuthors': booksAuthors.booksAuthors})
    })
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

router.get('/:id/delete', function(req, res, next) {
  console.log('req.params.id', req.params.id);
  db.book(req.params.id).then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthors(books);
    bookAuthorPromise.then(function(booksAuthors) {
      console.log('got to the delete link');
      res.render('books/delete',
                  {'book': booksAuthors.booksAuthors[0]})    })
  })
})

router.post('/:id/delete', function(req, res, next) {
  console.log('req.params.id', req.params.id);
  db.bookContributorsByBook(req.params.id).then(function(bookContributors) {
    console.log('!!!bookContributors', bookContributors);
    bookContributors.forEach(function(contributor) {
      db.deleteBookContributor(contributor.id).then(function() {
        console.log('req.params.id', req.params.id);
        db.deleteBook(req.params.id).then(function() {
          console.log('req.params.id', req.params.id);
          res.redirect('/books');
        })
      })
    })
  })
})

router.get('/:id/edit', function(req, res, next) {
  db.book(req.params.id).first().then(function(book) {
    db.bookContributorsByBook(req.params.id).then(function(bookContributors) {
      db.Authors().then(function(authors) {
        res.render('books/edit',
                    {'book': book,
                      'bookContributors': bookContributors,
                    'authors': authors,
                    'errors': []})
      })
    })
  })
})

router.post('/:id/edit', function(req, res, next) {
  console.log('req.body: ', req.body);
  db.updateBook(req.params.id,
    {title: req.body.title,
      genre: req.body.genre,
      cover_url: req.body.cover_url,
      description: req.body.description}).then( function() {
      db.Authors().count().then(function(count) {
        console.log('author count: ', count);
        res.redirect('/books/'+req.params.id)
      })
  })
})

router.get('/:id', function(req, res, next) {
  db.book(req.params.id).then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthors(books);
    bookAuthorPromise.then(function(booksAuthors) {
      console.log('got to the id link');
      res.render('books/show',
                  {'book': booksAuthors.booksAuthors[0]})
    })
  })
})

module.exports = router;
