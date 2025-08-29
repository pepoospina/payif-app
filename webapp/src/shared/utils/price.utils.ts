import {
  CartFull,
  PriceRange,
  ProductQuantityFull,
  RecipeFull,
  ValueWithUnits,
} from "../types/types.products";
import { convertUnits } from "./units.utils";

export const getPriceForQuantity = (
  prices: PriceRange[],
  quantity: ValueWithUnits
): { price: ValueWithUnits; total: number } => {
  let bestPrice: PriceRange | undefined = undefined;
  let convertedQuantity: ValueWithUnits = quantity;

  for (const price of prices) {
    // Convert quantity to match the units in the price range
    const quantityInPriceUnits = convertUnits(quantity, price.min.units);

    if (price.min.value <= quantityInPriceUnits.value) {
      bestPrice = price;
      convertedQuantity = quantityInPriceUnits;
    }
  }

  if (!bestPrice)
    throw new Error(`Price not found for quantity ${JSON.stringify(quantity)}`);

  return {
    price: {
      value: bestPrice.price,
      units: bestPrice.min.units,
    },
    total: bestPrice.price * convertedQuantity.value,
  };
};

export const getRecipeValue = (
  recipe: RecipeFull,
  quantity: ValueWithUnits
) => {
  // Convert quantity to match recipe batchSize units for scaling calculation
  const quantityInBatchUnits = convertUnits(quantity, recipe.batchSize.units);

  // Calculate scaling factor: how much of the recipe we need
  const scalingFactor = quantityInBatchUnits.value / recipe.batchSize.value;

  const ingredients: ProductQuantityFull[] = [];
  let total = 0;

  // Calculate price for each ingredient
  for (const ingredient of recipe.ingredients) {
    // Scale the ingredient quantity based on how much recipe we're making
    const scaledQuantity: ValueWithUnits = {
      value: ingredient.quantity.value * scalingFactor,
      units: ingredient.quantity.units,
    };

    // Get the price for this scaled ingredient quantity
    const ingredientPrice = getProductValue({
      product: ingredient.product,
      quantity: scaledQuantity,
    });

    // Add ingredient with price to the ingredients array
    ingredients.push({
      product: ingredient.product,
      quantity: scaledQuantity,
      value: ingredientPrice,
    });

    total += ingredientPrice;
  }

  return {
    ingredients,
    total,
  };
};

export const getProductValue = (item: ProductQuantityFull) => {
  if (item.product.recipe) {
    /** a product without prices gets its price derived from its recipe */
    return getRecipeValue(item.product.recipe, item.quantity).total;
  } else {
    if (!item.product.prices) throw new Error("Price not found");
    return getPriceForQuantity(item.product.prices, item.quantity).total;
  }
};

export const getCartTotal = (cart: CartFull) => {
  let total = 0;

  cart.products.forEach((product) => {
    total += getProductValue(product);
  });

  total = Math.round(total * 100) / 100;
  return total;
};
