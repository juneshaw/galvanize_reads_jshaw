exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id');
    table.string('user_name');
    table.string('password_hash');
    table.string('role');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
