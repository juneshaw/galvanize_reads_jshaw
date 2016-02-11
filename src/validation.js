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
    db.Books().then(function(books) {
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
  })
},

booksAndAuthorsOne: function(bookId) {
  return new Promise(function (resolve, reject) {
    var booksAuthors = [];
    var authors = [];
    db.Books().then(function(books) {
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
                booksAuthors.forEach(function(bookAuthor, index) {
                  if (bookAuthor.book.id == bookId) {
                    resolve({'booksAuthors': booksAuthors[index]});
                  }
                })
              }
            })
          })
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
        var authorToAdd = {'author': author,
                        'books': []};
        authorsBooks.push(authorToAdd);
        db.bookContributorsByAuthor(author.id).then(function(contributors) {
          contributors.forEach(function(contributor, bookIndex) {
            db.book(contributor.book_id).first().then(function(book) {
              authorsBooks[authorIndex]['books'].push(book);
              if ((authorIndex >= (authors.length-1)) && (bookIndex >= (contributors.length-1))) {
                resolve({'authorsBooks': authorsBooks});
              }
            })
          })
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
        console.log('************');
        var authorToAdd = {'author': author,
                        'books': []};
        console.log('getting books for author # ', authorIndex, author.id, ' ', author.first_name);
        authorsBooks.push(authorToAdd);
        db.bookContributorsByAuthor(author.id).then(function(contributors) {
          contributors.forEach(function(contributor, bookIndex) {
            db.book(contributor.book_id).first().then(function(book) {
              console.log('==============');
              console.log('book#', bookIndex, ' ', book, ' for that author');
              authorsBooks[authorIndex]['books'].push(book);
              if ((authorIndex >= (authors.length-1)) && (bookIndex >= (contributors.length-1))) {
                console.log('finished on authorIndex of ', authorIndex, 'bookIndex of ', bookIndex);
                authorsBooks.forEach(function(authorBook, index) {
                  if (authorBook.author.id == authorId) {
                    resolve({'authorsBooks': authorsBooks[index]});
                  }
                })
              }
            })
          })
        })
      })
    })
  })
},

}
