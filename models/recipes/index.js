const moment = require("moment");

const Recipe = function(dbRecipe) {
  this.id = dbRecipe.id;
  this.name = dbRecipe.name;
  this.description = dbRecipe.description;
  this.categories = dbRecipe.categories.split("|");
  this.rating = dbRecipe.rating;
  this.ingredients = dbRecipe.ingredients.split("|");
  this.prepTime = dbRecipe.prep_time;
  this.cookTime = dbRecipe.cook_time;
  this.totalTime = dbRecipe.total_time;
  this.directions = dbRecipe.directions.split("|");
  this.calories = dbRecipe.calories;
  this.fat = dbRecipe.fat;
  this.carbohydrates = dbRecipe.carbohydrates;
  this.protein = dbRecipe.protein;
  this.cholesterol = dbRecipe.cholesterol;
  this.sodium = dbRecipe.sodium;
  this.author = dbRecipe.author;
  this.source = dbRecipe.source;
  this.createdAt = new Date(dbRecipe.created_at);
};

Recipe.prototype.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    categories: this.categories,
    rating: this.rating,
    ingredients: this.ingredients,
    prepTime: this.prepTime,
    cookTime: this.cookTime,
    totalTime: this.totalTime,
    directions: this.directions,
    calories: this.calories,
    fat: this.fat,
    carbohydrates: this.carbohydrates,
    protein: this.protein,
    cholesterol: this.cholesterol,
    sodium: this.sodium,
    author: this.author,
    source: this.source,
    createdAt: moment(this.createdAt).format("hh:mm:ss")
  };
};

module.exports = knex => {
  return {
    create: require("./create")(knex, Recipe),
    list: require("./list")(knex, Recipe),
    delete: require("./delete")(knex, Recipe),
    mutate: require("./mutate")(knex, Recipe),
    retrive: require("./retrive")(knex, Recipe)
  };
};
