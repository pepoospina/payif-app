import { array, boolean, number, object, string } from 'yup';

export const getCategoriesSchema = object({}).noUnknown(true);

export const commonQuerySchema = object({
  fromId: string().optional(),
  category: string().optional(),
  amount: number().required(),
  ownerId: string().optional(),
}).noUnknown(true);

export const getElementSchema = object({
  id: string().required(),
}).noUnknown(true);

export const getProductsSchema = object({
  query: commonQuerySchema.required(),
}).noUnknown(true);

export const searchProductsSchema = object({
  query: string().optional(),
}).noUnknown(true);

export const valueWithUnitsSchema = object({
  value: number().required(),
  units: string().required(),
});

export const productQuantitySchema = object({
  product: object().required(),
  quantity: valueWithUnitsSchema.required(),
  value: number().optional(),
});

export const recipeSchema = object({
  batchSize: valueWithUnitsSchema.required(),
  ingredients: array().of(productQuantitySchema).required(),
}).noUnknown(true);

export const createProductSchema = object({
  name: string().required(),
  description: string().optional(),
  unitType: string().required(),
  recipe: recipeSchema.required(),
}).noUnknown(true);

export const updateProductSchema = object({
  id: string().required(),
  product: object().when('delete', {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => createProductSchema.optional(),
  }),
  delete: boolean().optional(),
}).noUnknown(true);
