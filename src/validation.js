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

booksAndAuthors: function() {
  return new Promise(function (resolve, reject) {
    console.log('i just got inside the promise');
    var booksAuthors = [];
    var authors = [];
    db.Books().then(function(books) {
      books.forEach(function(book, bookIndex) {
        var bookToAdd = {'book': book,
                        'authors': []};
        booksAuthors.push(bookToAdd);
        booksAuthors[bookIndex]['authors'] = [];
        db.bookContributorsByBook(book.id).then(function(contributors) {
          console.log('here are the contributors', contributors);
          contributors.forEach(function(contributor, authorIndex) {
            console.log('here is the contributor!!!!: ', contributor);
            db.author(contributor.author_id).then(function(author) {
              console.log('pushing an author', author);
              booksAuthors[bookIndex]['authors'].push(author);
              console.log('booksAuthors authors: ', booksAuthors[bookIndex]['authors']);
              // booksAuthors[index][authors]=authors;
              console.log('*****contributors: ', contributors.length, authorIndex);
              console.log('****books: ', books.length, bookIndex);
              if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
                resolve({'booksAuthors': booksAuthors});
              }
              // resolve({'booksAuthors': booksAuthors});
            })
          })
        })
      })
    })
  })
},

}
