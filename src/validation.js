var db = require('./db')

module.exports = {

login: function(loginInputs) {
  return new Promise(function (resolve, reject) {
    var errors = [];
    db.userByName(loginInputs.userName).then(function(results) {
      if (!results) {
        errors.push('No such user name');
      }
      resolve({'errors': errors});
    })
  })
},

booksAndAuthors: function(books) {
  return new Promise(function (resolve, reject) {
    var booksAuthors = [];
    var authors = [];
    // db.Books().then(function(books) {
    books.forEach(function(book, bookIndex) {
      var bookToAdd = {'book': book,
                      'authors': []};
      booksAuthors.push(bookToAdd);
      booksAuthors[bookIndex]['authors'] = [];
      db.bookContributorsByBook(book.id).then(function(contributors) {
        contributors.forEach(function(contributor, authorIndex) {
          db.author(contributor.author_id).first().then(function(author) {
            booksAuthors[bookIndex]['authors'].push(author);
            if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
              resolve({'booksAuthors': booksAuthors});
            }
          })
        })
      })
    })
  })
},

}
