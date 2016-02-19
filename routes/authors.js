var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')
var jquery = require('jquery')

router.get('/', function(req, res, next) {
  db.Authors().then(function(authors) {
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      res.render('authors/index',
                {'authorsBooks': authorsBooks.authorsBooks})
    })
  })
})

router.get('/new', function(req, res, next) {
    db.Books().then(function(books) {
      res.render('authors/new',
                  {'author': {first_name:'', last_name:'', biography:'', portrait_url:''},
                    // 'bookContributors': [],
                    'authorBooks': [],
                  'books': books,
                  'errors': []})
  })
})

router.post('/new', function(req, res, next) {
  var newAuthor = {'first_name':req.body.first_name,
                  'last_name': req.body.last_name,
                  'biography': req.body.biography,
                  'portrait_url': req.body.portrait_url}
  db.insertAuthor(newAuthor).then( function(author) {
    req.body.bookSelectIds.forEach(function(bookSelectId, bookSelectIdIndex) {
      if (bookSelectId != 0) {
        db.insertBookContributor({'author_id': author[0],
                                  'book_id': bookSelectId}).then(function(results) {
          if (bookSelectIdIndex === req.body.bookSelectIds.length-1) {
            res.redirect('/authors');
          }
        })
      } else if (bookSelectIdIndex === req.body.bookSelectIds.length-1) {
        res.redirect('/authors');
      }
    })
  })
})

router.get('/:id/delete', function(req, res, next) {
  db.author(req.params.id).first().then(function(authors) {
    var authorBookPromise = validation.authorsAndBooksOne(req.params.id);
    authorBookPromise.then(function(authorsBooks) {
      res.render('authors/delete',
                  {'author': authorsBooks.authorsBooks})
    })
  })
})

router.post('/:id/delete', function(req, res, next) {
  db.bookContributorsByAuthor(req.params.id).del().then(function(bookContributors) {
    db.deleteAuthor(req.params.id).then(function() {
      res.redirect('/authors');
    })
  })
})

router.get('/:id/edit', function(req, res, next) {
  db.author(req.params.id).first().then(function(author) {
    db.Books().then(function(books) {
      var authorBooks =[];
      db.bookContributorsByAuthor(req.params.id).then(function(bookContributors) {
        if (bookContributors.length === 0) {
          res.render('authors/edit',
          {'author': author,
          'authorBooks': [],
          'books': books,
          'errors': []})
        } else {
          bookContributors.forEach(function(bookContributor, contributorIndex) {
            db.book(bookContributor.book_id).first().then(function(book) {
              authorBooks.push(book);
              if (authorBooks.length === bookContributors.length) {
                res.render('authors/edit',
                {'author': author,
                'authorBooks': authorBooks,
                'books': books,
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
  db.bookContributorsByAuthor(req.params.id).del().then(function(results) {
    db.updateAuthor(req.params.id,
          {first_name: req.body.first_name,
            last_name: req.body.last_name,
            portrait_url: req.body.portrait_url,
            biography: req.body.biography}).then( function() {
      req.body.bookSelectIds.forEach(function(bookSelectId, bookSelectIdIndex) {
        if (bookSelectId != 0) {
          db.insertBookContributor({'author_id': req.params.id,
                                    'book_id': bookSelectId}).then(function(results) {
            if (bookSelectIdIndex === req.body.bookSelectIds.length-1) {
              res.redirect('/authors/'+req.params.id);
            }
          })
        } else if (bookSelectIdIndex === req.body.bookSelectIds.length-1) {
          res.redirect('/authors/'+req.params.id);
        }
      })
    })
  })
})

router.get('/:id', function(req, res, next) {
  var authorBookPromise = validation.authorsAndBooksOne(req.params.id);
  authorBookPromise.then(function(authorsBooks) {
    res.render('authors/show',
                {'author': authorsBooks.authorsBooks})
  })
})

module.exports = router;
