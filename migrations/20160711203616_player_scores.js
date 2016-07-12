exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table) {
    table.increments();
    table.string('name');
    table.string('picture');
    table.integer('score');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
