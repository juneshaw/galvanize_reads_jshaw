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
   return(Authors().insert(author).select(currval('id')));
},

  author: function(id) {
  return(Authors().where('id', id))
},

 updateAuthor: function(id, author) {
  return(Authors().where('id', id).update(author));
},

  deleteAuthor: function(id) {
  return(Authors().where('id', id).del())
},

  insertBook: function(book) {
  return(Books().insert(book).select(currval('id')));
},

  book: function(id) {
  return(Books().where('id', id))
},

  updateBook: function(id, bookContributor) {
  return(Books().where('id', id).update(bookContributor));
},

  deleteBook: function(id) {
  return(Books().where('id', id).del());
},

  insertBookContributor: function(bookContributor) {
    return(BookContributors().insert(bookContributor).select(currval('id')));
},

  bookContributor: function (id) {
  return(BookContributors().where('id', id))
},

  updateBookContributor: function(id, bookContributor) {
  return(BookContributors().where('id', id).update(bookContributor));
},

  deleteBookContributor: function(id) {
  return(BookContributors().where('id', id).del());
},

  insertUser: function (user) {
    return(Users().insert(user).select(currval('id')));
},

  user: function(id) {
    return(Users().where('id', id))
},

  updateUser: function(id, user) {
    return(Users().where('id', id).update(user));
},

  deleteUser: function(id) {
    return(Users().where('id', id).del())
},

  userByName: function(user_name) {
    return(this.Users().where('user_name', user_name));
  }
};
