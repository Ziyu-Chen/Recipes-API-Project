module.exports = (knex, Recipe) => {
  return params => {
    let category;
    if (params) {
      category = params.category;
    }

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
    let page, limit;
    if (!params) {
      page = 1;
      limit = 10;
    } else {
      page = params.page ? params.page : 1;
      limit = params.limit ? params.limit : 10;
    }

    return (
      knex("recipes")
        .where("id", ">", (page - 1) * limit)
        .andWhere("id", "<", page * limit + 1)
        .select()
        .then(recipes => {
          return recipes.map(recipe => new Recipe(recipe));
        })
        // create a recipe model out of the plain database response
        .catch(err => {
          console.log("List Error!");
          console.log(err);
        })
    );
  };
};
