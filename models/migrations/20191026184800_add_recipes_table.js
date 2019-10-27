exports.up = function(knex, Promise) {
  // create the 'recipes' table with three columns
  return knex.schema.createTable("recipes", t => {
    t.increments() // auto-incrementing id column
      .primary()
      .index(); // index this column

    t.string("name", 10000) // maximum length of 50 characters
      .notNullable() // add a not-null constraint to this column
      .index(); // index it

    t.string("description", 10000); // maximum length of 300 characters
    t.string("categories", 10000);
    t.float("rating");
    t.string("ingredients", 10000);
    t.integer("prep_time");
    t.integer("cook_time");
    t.integer("total_time");
    t.string("directions", 10000);
    t.float("calories");
    t.float("fat");
    t.float("carbohydrates");
    t.float("protein");
    t.float("cholesterol");
    t.float("sodium");
    t.string("author");
    t.string("source");

    t.timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now()); // default to the current time
  });
};

exports.down = function(knex, Promise) {
  // undo this migration by destroying the 'recipes' table
  return knex.schema.dropTable("recipes");
};
