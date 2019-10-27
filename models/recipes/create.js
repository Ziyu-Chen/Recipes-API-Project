module.exports = (knex, Recipe) => {
  return params => {
    const {
      name,
      description,
      categories,
      rating,
      ingredients,
      prepTime,
      cookTime,
      totalTime,
      directions,
      calories,
      fat,
      carbohydrates,
      protein,
      cholesterol,
      sodium,
      author,
      source
    } = params;

    return (
      knex("recipes")
        .insert({
          name,
          description,
          categories: categories.join("|"),
          rating,
          ingredients: ingredients.join("|"),
          prep_time: prepTime,
          cook_time: cookTime,
          total_time: totalTime,
          directions: directions.join("|"),
          calories,
          fat,
          carbohydrates,
          protein,
          cholesterol,
          sodium,
          author,
          source
        })
        .then(() => {
          return knex("recipes")
            .where({ name: name, author: author })
            .select();
        })
        .then(recipes => new Recipe(recipes.pop()))
        // create a recipe model out of the plain database response
        .catch(err => {
          console.log("List Error!");
          console.log(err);
        })
    );
  };
};
