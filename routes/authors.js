var express = require('express')
var router = express.Router()
var db = require('../src/db.js')
var validation = require('../src/validation.js')

router.get('/', function(req, res, next) {
  console.log('in the main author page');
  db.Authors().then(function(authors) {
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      console.log('got back from the promise');
      res.render('authors/index',
                {'authorsBooks': authorsBooks.authorsBooks})
    })
  })
});

router.get('/new', function(req, res, next) {
  console.log('entered the new, getting the books');
    db.Books().then(function(books) {
      console.log('got the books, rendering the page');
      res.render('authors/new',
                  {'author': {first_name:'', last_name:'', biography:'', portrait_url:''},
                    'bookContributors': [],
                  'books': books,
                  'errors': []})
  })
});

router.post('/new', function(req, res, next) {
  console.log('in the post for new');
  var newAuthor = {'first_name':req.body.first_name,
                  'last_name': req.body.last_name,
                  'biography': req.body.biography,
                  'portrait_url': req.body.portrait_url}
  db.insertAuthor(newAuthor).then( function(results) {
                    console.log('results from insert:', results);
                    //add code to add bookContributors
    res.redirect('/authors')
  })
})

router.get('/:id/delete', function(req, res, next) {
  console.log('in the author delete');
  db.author(req.params.id).then(function(authors) {
    console.log('just got the authors: ', authors);
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      console.log('back from the promise with authorsBooks', authorsBooks);
      console.log('sending to delete:', authorsBooks.authorsBooks[0])
      res.render('authors/delete',
                  {'author': authorsBooks.authorsBooks[0]})
    })
  })
});

//What should I do if they want to delete an author that is a contributor?
//Just remove the author from the book contributors?
//Or make it not selectable, but still shown as a contributor?
//What should the click through of the author show on an old book, though?

router.post('/:id/delete', function(req, res, next) {
  db.bookContributorsByAuthor(req.params.id).then(function(bookContributors) {
    bookContributors.forEach(function(contributor) {
      db.deleteBookContributor(contributor.id).then(function() {
        db.deleteAuthor(req.params.id).then(function() {
          res.redirect('/authors');
        })
      })
    })
  })
});

router.get('/:id/edit', function(req, res, next) {
  db.author(req.params.id).first().then(function(author) {
    db.bookContributorsByAuthor(req.params.id).then(function(bookContributors) {
      console.log('!!!!', bookContributors)
      db.Books().then(function(books) {
        res.render('authors/edit',
                    {'author': author,
                      'bookContributors': bookContributors,
                    'books': books,
                    'errors': []})
      })
    })
  })
});

router.post('/:id/edit', function(req, res, next) {
  db.updateAuthor(req.params.id,
    {first_name: req.body.first_name,
      last_name: req.body.last_name,
      portrait_url: req.body.portrait_url,
      biography: req.body.biography}).then( function() {
    db.Books().count().then(function(count) {
      console.log('book count: ', count);
      res.redirect('/books/'+req.params.id)
    })
  })
});

router.get('/:id', function(req, res, next) {
  db.author(req.params.id).then(function(authors) {
    var authorBookPromise = validation.authorsAndBooks(authors);
    authorBookPromise.then(function(authorsBooks) {
      console.log('got to the id link');
      res.render('authors/show',
                  {'author': authorsBooks.authorsBooks[0]})
    })
  })
});

module.exports = router;
