var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')
var jquery = require('jquery')

router.get('/', function(req, res, next) {
  db.Books().then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthors(books);
    bookAuthorPromise.then(function(booksAuthors) {
      console.log('in books get');
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
                  'bookAuthors': [],
                  'authors': authors,
                  'errors': []})
  })
});

router.post('/new', function(req, res, next) {
  console.log('in the new post: req.body: ', req.body);
  var newBook = {'title':req.body.title,
  'genre': req.body.genre,
  'cover_url': req.body.cover_url,
  'description': req.body.description}
  db.insertBook(newBook).then(function(book) {
    console.log('||||||||||||new insert book id: ', book);
    console.log('after getting the authorSelectIDs: ', req.body.authorSelectIds);
    console.log('req author length: ', req.body.authorSelectIds.length);
    req.body.authorSelectIds.forEach(function(authorSelectId, authorSelectIdIndex) {
      console.log('each authorSelectID: ', authorSelectId);
      if (authorSelectId != 0) {
        db.insertBookContributor({'book_id': book[0],
                                  'author_id': authorSelectId}).then(function() {
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
  console.log('in the delete****');
  db.bookContributorsByBook(req.params.id).del().then(function(bookContributors) {
    console.log('after the delete of book contributors');
    db.deleteBook(req.params.id).then(function() {
      console.log('deleting req.params.id****', req.params.id);
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
          'bookContributors': [],
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
                'bookContributors': bookContributors,
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
  db.bookContributorsByBook(req.params.id).del().then(function(results) {
    db.updateBook(req.params.id,
      {title: req.body.title,
        genre: req.body.genre,
        cover_url: req.body.cover_url,
        description: req.body.description}).then( function() {
        console.log('req.body***********: ', req.body);
      req.body.authorSelectIds.forEach(function(authorSelectId, authorSelectIdIndex) {
        if (authorSelectId != 0) {
          db.insertBookContributor({'book_id': req.params.id,
                                    'author_id': authorSelectId}).then(function() {
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
  db.book(req.params.id).then(function(books) {
    var bookAuthorPromise = validation.booksAndAuthorsOne(req.params.id);
    bookAuthorPromise.then(function(booksAuthors) {
      res.render('books/show',
                  {'book': booksAuthors.booksAuthors})
    })
  })
})

module.exports = router;
