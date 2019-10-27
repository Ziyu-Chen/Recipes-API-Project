module.exports = (knex, Recipe) => {
  return params => {
    const { id, name, category } = params;
    if (category) {
      return (
        knex("recipes")
          .select()
          .then(recipes => {
            recipes = recipes.map(recipe => new Recipe(recipe));
            return recipes.filter(recipe =>
              recipe.categories.includes(category)
            );
          })
          // create a recipe model out of the plain database response
          .catch(err => {
            console.log("List Error!");
            console.log(err);
          })
      );
    }
    const conditions = {};
    if (id) {
      conditions.id = id;
    }
    if (name) {
      conditions.name = name;
    }
    return (
      knex("recipes")
        .where(conditions)
        .select()
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
