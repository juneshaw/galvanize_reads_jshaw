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
    return db.Books().then(function(books) {
      books.forEach(function(book, bookIndex) {
        var bookToAdd = {'book': book,
                        'authors': []};
        booksAuthors.push(bookToAdd);
        booksAuthors[bookIndex]['authors'] = [];
        return db.bookContributorsByBook(book.id).then(function(contributors) {
          if ((!contributors.length) && (bookIndex>=books.length-1)) {
            resolve({'booksAuthors': booksAuthors});
          } else {
            contributors.forEach(function(contributor, authorIndex) {
              return db.author(contributor.author_id).first().then (function(author) {
                booksAuthors[bookIndex]['authors'].push(author);
                if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
                  resolve({'booksAuthors': booksAuthors});
                }
              })
            })
          }
        })
      })
    })
  })
},

booksAndAuthorsOne: function(bookId) {
  return new Promise(function (resolve, reject) {
    var booksAuthors = [];
    var authors = [];
    return db.Books().then(function(books) {
      books.forEach(function(book, bookIndex) {
        var bookToAdd = {'book': book,
                        'authors': []};
        booksAuthors.push(bookToAdd);
        booksAuthors[bookIndex]['authors'] = [];
        return db.bookContributorsByBook(book.id).then(function(contributors) {
          if ((!contributors.length) && (bookIndex>=books.length-1)) {
            resolve({'booksAuthors': booksAuthors[book_index]});
          } else {
            contributors.forEach(function(contributor, authorIndex) {
              return db.author(contributor.author_id).first().then(function(author) {
                booksAuthors[bookIndex]['authors'].push(author);
                if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
                  booksAuthors.forEach(function(bookAuthor, index) {
                    if (bookAuthor.book.id == bookId) {
                      resolve({'booksAuthors': booksAuthors[index]});
                    }
                  })
                }
              })
            })
          }
        })
      })
    })
  })
},

authorsAndBooks: function(authors) {
  return new Promise(function (resolve, reject) {
    var authorsBooks = [];
    var books = [];
    db.Authors().then(function(authors) {
      authors.forEach(function(author, authorIndex) {
        console.log('outer authorIndex: ', authorIndex);
        var authorToAdd = {'author': author,
                        'books': []};
        authorsBooks.push(authorToAdd);
        authorsBooks[authorIndex]['books'] = [];
         db.bookContributorsByAuthor(author.id).then(function(contributors) {
          console.log('inner authorIndex: ', authorIndex);
          if ((!contributors.length) && (authorIndex>=authors.length-1)) {
            resolve({'authorsBooks': authorsBooks});
          } else {
            contributors.forEach(function(contributor, bookIndex) {
              db.book(contributor.book_id).first().then(function(book) {
                authorsBooks[authorIndex]['books'].push(book);
                if ((authorIndex >= (authors.length-1)) && (bookIndex >= (contributors.length-1))) {
                  resolve({'authorsBooks': authorsBooks});
                }
              })
            })
          }
        })
      })
    })
  })
},

authorsAndBooksOne: function(authorId) {
  return new Promise(function (resolve, reject) {
    var authorsBooks = [];
    var books = [];
    db.Authors().then(function(authors) {
      authors.forEach(function(author, authorIndex) {
        console.log('outer authorIndex=', authorIndex);
        var authorToAdd = {'author': author,
                        'books': []};
        authorsBooks.push(authorToAdd);
        authorsBooks[authorIndex]['books'] = [];
        db.bookContributorsByAuthor(author.id).then(function(contributors) {
          console.log('inner authorIndex=', authorIndex);
          if ((!contributors.length) && (authorIndex>=authors.length-1)) {
            resolve({'authorsBooks': authorsBooks[author_index]});
          } else {
            contributors.forEach(function(contributor, bookIndex) {
            db.book(contributor.book_id).first().then(function(book) {
              authorsBooks[authorIndex]['books'].push(book);
              if ((authorIndex >= (authors.length-1)) && (bookIndex >= (contributors.length-1))) {
                authorsBooks.forEach(function(authorBook, index) {
                  if (authorBook.author.id == authorId) {
                    resolve({'authorsBooks': authorsBooks[index]});
                  }
                  })
                }
              })
            })
          }
        })
      })
    })
  })
},

}
