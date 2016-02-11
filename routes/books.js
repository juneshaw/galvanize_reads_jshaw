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
    db.Authors().then(function(authors) {
      res.render('books/new',
                  {'book': {'title':'', 'genre':'', 'cover_url':'', 'description':''},
                  'bookContributors': [],
                  'authors': authors,
                  'errors': []})
  })
});

router.post('/new', function(req, res, next) {
  console.log('in the new post');
  var newBook = {'title':req.body.title,
                  'genre': req.body.genre,
                  'cover_url': req.body.cover_url,
                  'description': req.body.description}
  db.insertBook(newBook).then( function(results) {
    console.log('results from insertBook: ', results);
    console.log('****', req.body.author1, req.body.author2);
    // req.body.authors.forEach(function(author) {
      // db.insertBookContributors({'book_id': results.id,
                                // 'author_id': author.id}).then(function() {
        res.redirect('/books')
      // })
    // })
  })
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
  db.book(req.params.id).then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthors(books);
    bookAuthorPromise.then(function(booksAuthors) {
      res.render('books/delete',
                  {'book': booksAuthors.booksAuthors[0]})    })
  })
})

router.post('/:id/delete', function(req, res, next) {
  db.bookContributorsByBook(req.params.id).then(function(bookContributors) {
    bookContributors.forEach(function(contributor) {
      db.deleteBookContributor(contributor.id).then(function() {
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
      res.render('books/show',
                  {'book': booksAuthors.booksAuthors[0]})
    })
  })
})

module.exports = router;
