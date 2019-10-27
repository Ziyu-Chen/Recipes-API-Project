module.exports = function(knex) {
  return {
    recipes: require("./recipes")(knex)
  };
};
