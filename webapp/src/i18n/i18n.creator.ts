export enum CreatorKeys {
  add = "creator-s002",
  searchProduct = "creator-s003",
  name = "creator-s004",
  description = "creator-s005",
  batchSize = "creator-s006",
  recipe = "creator-s007",
  emptyRecipe = "creator-s008",
  recipeCreated = "creator-s009",
  viewRecipe = "creator-s010",
  cancel = "creator-s011",
  edit = "creator-s012",
}

export const creatorValuesENG: Record<CreatorKeys, string> = {
  [CreatorKeys.add]: "Create recipe",
  [CreatorKeys.searchProduct]: "Add ingredient",
  [CreatorKeys.name]: "Name",
  [CreatorKeys.description]: "Description",
  [CreatorKeys.batchSize]: "Batch size",
  [CreatorKeys.recipe]: "Recipe",
  [CreatorKeys.emptyRecipe]: "No ingredients added yet",
  [CreatorKeys.recipeCreated]: "Recipe created",
  [CreatorKeys.viewRecipe]: "View recipe",
  [CreatorKeys.cancel]: "Cancel",
  [CreatorKeys.edit]: "Update recipe",
};

export const creatorValuesSPA: Record<CreatorKeys, string> = {
  [CreatorKeys.add]: "Crear receta",
  [CreatorKeys.searchProduct]: "Añadir ingrediente",
  [CreatorKeys.name]: "Nombre",
  [CreatorKeys.description]: "Descripción",
  [CreatorKeys.batchSize]: "Producció",
  [CreatorKeys.recipe]: "Receta",
  [CreatorKeys.emptyRecipe]: "Aun no has añadido ingredientes",
  [CreatorKeys.recipeCreated]: "Receta creada",
  [CreatorKeys.viewRecipe]: "Ver receta",
  [CreatorKeys.cancel]: "Cancelar",
  [CreatorKeys.edit]: "Actualizar receta",
};

export const creatorValuesCAT: Record<CreatorKeys, string> = {
  [CreatorKeys.add]: "Crear recepta",
  [CreatorKeys.searchProduct]: "Afegeix ingredient",
  [CreatorKeys.name]: "Nom",
  [CreatorKeys.description]: "Descripció",
  [CreatorKeys.batchSize]: "Producció",
  [CreatorKeys.recipe]: "Recepta",
  [CreatorKeys.emptyRecipe]: "Encara no has afegit cap ingredient",
  [CreatorKeys.recipeCreated]: "Recepta creada",
  [CreatorKeys.viewRecipe]: "Veure recepta",
  [CreatorKeys.cancel]: "Cancelar",
  [CreatorKeys.edit]: "Actualitzar recepta",
};
