const recipes = require("../../recipes.json");

exports.up = function(knex, Promise) {
  // create the 'recipes' table with three columns
  return knex("recipes").insert(recipes);
};

exports.down = function(knex, Promise) {
  // undo this migration by destroying the 'recipes' table
  return knex("recipes").del();
};
