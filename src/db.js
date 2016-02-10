var knex = require('../db/knex')

module.exports =
{
  Authors: function() {
  return knex('authors');
},

  Books: function() {
  return knex('books');
},

  BookContributors: function() {
  return knex('book_contributors');
},

  Users: function() {
  return knex('users');
},

  insertAuthor: function (author) {
   return(this.Authors().insert(author).select(currval('id')));
},

  author: function(id) {
    console.log('author id required: ', id);
  return(this.Authors().where('id', id))
},

 updateAuthor: function(id, author) {
  return(this.Authors().where('id', id).update(author));
},

  deleteAuthor: function(id) {
  return(this.Authors().where('id', id).del())
},

  insertBook: function(book) {
  return(this.Books().insert(book).select(currval('id')));
},

  book: function(id) {
  return(this.Books().where('id', id))
},

  updateBook: function(id, bookContributor) {
  return(this.Books().where('id', id).update(bookContributor));
},

  deleteBook: function(id) {
  return(this.Books().where('id', id).del());
},

  insertBookContributor: function(bookContributor) {
    return(this.BookContributors().insert(bookContributor).select(currval('id')));
},

  bookContributor: function (id) {
  return(this.BookContributors().where('id', id))
},

  updateBookContributor: function(id, bookContributor) {
  return(this.BookContributors().where('id', id).update(bookContributor));
},

  deleteBookContributor: function(id) {
  return(this.BookContributors().where('id', id).del());
},

  insertUser: function (user) {
    return(this.Users().insert(user).select(currval('id')));
},

  user: function(id) {
    return(this.Users().where('id', id))
},

  updateUser: function(id, user) {
    return(this.Users().where('id', id).update(user));
},

  deleteUser: function(id) {
    return(this.Users().where('id', id).del())
},

  userByName: function(user_name) {
    return(this.Users().where('user_name', user_name));
  },

  bookContributorsByBook: function(book_id) {
    return(this.BookContributors().where('book_id', book_id));
  },

  bookContributorsByAuthor: function(author_id) {
    return(this.BookContributors().where('author_id', author_id));
  }

};
