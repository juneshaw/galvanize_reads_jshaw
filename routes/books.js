var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')
var jquery = require('jquery')

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
                  // 'bookContributors': [],
                  'bookAuthors': [],
                  'authors': authors,
                  'errors': []})
  })
});

router.post('/new', function(req, res, next) {
  var newBook = {'title':req.body.title,
  'genre': req.body.genre,
  'cover_url': req.body.cover_url,
  'description': req.body.description}
  db.insertBook(newBook).then(function(book) {
    req.body.authorSelectIds.forEach(function(authorSelectId, authorSelectIdIndex) {
      if (authorSelectId != 0) {
        db.insertBookContributor({'book_id': book[0],
                                  'author_id': authorSelectId}).then(function(results) {
          if (authorSelectIdIndex === req.body.authorSelectIds.length-1) {
            res.redirect('/books');
          }
        })
      } else if (authorSelectIdIndex === req.body.authorSelectIds.length-1) {
        res.redirect('/books');
      }
    })
  })
})

router.get('/:id/delete', function(req, res, next) {
  db.book(req.params.id).first().then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthorsOne(req.params.id);
    bookAuthorPromise.then(function(booksAuthors) {
      res.render('books/delete',
                  {'book': booksAuthors.booksAuthors})    })
  })
})

router.post('/:id/delete', function(req, res, next) {
  db.bookContributorsByBook(req.params.id).del().then(function(bookContributors) {
    db.deleteBook(req.params.id).then(function() {
      res.redirect('/books');
    })
  })
})

router.get('/:id/edit', function(req, res, next) {
  db.book(req.params.id).first().then(function(book) {
    db.Authors().then(function(authors) {
      var bookAuthors =[];
      db.bookContributorsByBook(req.params.id).then(function(bookContributors) {
        if (bookContributors.length === 0) {
          res.render('books/edit',
          {'book': book,
          'bookAuthors': [],
          'authors': authors,
          'errors': []})
        } else {
          bookContributors.forEach(function(bookContributor, contributorIndex) {
            db.author(bookContributor.author_id).first().then(function(author) {
              bookAuthors.push(author);
              if (bookAuthors.length === bookContributors.length) {
                res.render('books/edit',
                {'book': book,
                'bookAuthors': bookAuthors,
                'authors': authors,
                'errors': []})
              }
            })
          })
        }
      })
    })
  })
})

router.post('/:id/edit', function(req, res, next) {
  console.log('in edit');
  db.bookContributorsByBook(req.params.id).del().then(function(results) {
    console.log('after delete of book cons');
    db.updateBook(req.params.id,
      {title: req.body.title,
        genre: req.body.genre,
        cover_url: req.body.cover_url,
        description: req.body.description}).then( function() {
      req.body.authorSelectIds.forEach(function(authorSelectId, authorSelectIdIndex) {
        if (authorSelectId != 0) {
          db.insertBookContributor({'book_id': req.params.id,
                                    'author_id': authorSelectId}).then(function(results) {
            if (authorSelectIdIndex === req.body.authorSelectIds.length-1) {
              res.redirect('/books/'+req.params.id);
            }
          })
        } else if (authorSelectIdIndex === req.body.authorSelectIds.length-1) {
          res.redirect('/books/'+req.params.id);
        }
      })
    })
  })
})

router.get('/:id', function(req, res, next) {
  var bookAuthorPromise = validation.booksAndAuthorsOne(req.params.id);
  bookAuthorPromise.then(function(booksAuthors) {
    res.render('books/show',
                {'book': booksAuthors.booksAuthors})
  })
})

module.exports = router;
