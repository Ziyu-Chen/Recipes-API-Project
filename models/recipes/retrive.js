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
