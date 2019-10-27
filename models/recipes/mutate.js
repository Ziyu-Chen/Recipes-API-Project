module.exports = (knex, Recipe) => {
  return params => {
    const { id, name, input } = params;
    const conditions = {};
    if (id) {
      conditions.id = id;
    }
    if (name) {
      conditions.name = name;
    }
    const mutation = {
      name: input.name,
      description: input.description,
      categories: input.categories.join("|"),
      rating: input.rating,
      ingredients: input.ingredients.join("|"),
      prep_time: input.prepTime,
      cook_time: input.cookTime,
      total_time: input.totalTime,
      directions: input.directions.join("|"),
      calories: input.calories,
      fat: input.fat,
      carbohydrates: input.carbohydrates,
      protein: input.protein,
      cholesterol: input.cholesterol,
      sodium: input.sodium,
      author: input.author,
      source: input.source
    };
    return (
      knex("recipes")
        .where(conditions)
        .update(mutation)
        .then(() => {
          return knex("recipes")
            .where(conditions)
            .select();
        })
        .then(recipes => {
          return new Recipe(recipes.pop());
        })
        // create a recipe model out of the plain database response
        .catch(err => {
          console.log("List Error!");
          console.log(err);
        })
    );
  };
};
