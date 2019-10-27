module.exports = (knex, Recipe) => {
  return params => {
    const { id, name } = params;
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
        .del()
        .then(() => {
          return knex("recipes").select();
        })
        .then(recipes => recipes.map(recipe => new Recipe(recipe)))
        // create a recipe model out of the plain database response
        .catch(err => {
          console.log("List Error!");
          console.log(err);
        })
    );
  };
};
