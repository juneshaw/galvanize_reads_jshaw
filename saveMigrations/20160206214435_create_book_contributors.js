exports.up = function(knex, Promise) {
  return knex.schema.createTable('book_contributors', function(table){
    table.increments('id');
    table.integer('author_id');
    table.integer('book_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('book_contributors');
};
