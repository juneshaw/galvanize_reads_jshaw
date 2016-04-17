
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('book_contributors').del(),

    // Inserts seed entries
    knex('book_contributors').insert({id: 5001, book_id: 5001, author_id: 5001}),
    knex('book_contributors').insert({id: 5002, book_id: 5001, author_id: 5005}),
    knex('book_contributors').insert({id: 5003, book_id: 5001, author_id: 5006}),
    knex('book_contributors').insert({id: 5004, book_id: 5002, author_id: 5002}),
    knex('book_contributors').insert({id: 5005, book_id: 5003, author_id: 5003}),
    knex('book_contributors').insert({id: 5006, book_id: 5004, author_id: 5004}),
    knex('book_contributors').insert({id: 5007, book_id: 5005, author_id: 5004}),
    knex('book_contributors').insert({id: 5008, book_id: 5006, author_id: 5004})
  );
};
