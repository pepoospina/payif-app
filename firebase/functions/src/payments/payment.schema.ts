import { boolean, number, object, string } from "yup";

export const getCategoriesSchema = object({}).noUnknown(true);

export const commonQuerySchema = object({
  fromId: string().optional(),
  category: string().optional(),
  amount: number().required(),
  ownerId: string().optional(),
}).noUnknown(true);

export const getPaymentSchema = object({
  id: string().required(),
}).noUnknown(true);

export const getProductsSchema = object({
  query: commonQuerySchema.required(),
}).noUnknown(true);

export const searchProductsSchema = object({
  query: string().optional(),
}).noUnknown(true);

export const createPaymentSchema = object({
  id: string().optional(),
  token: string().required(),
  amount: string().required(),
  payer: string().required(),
  receiver: string().required(),
}).noUnknown(true);

export const updateProductSchema = object({
  id: string().required(),
  product: object().when("delete", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => createPaymentSchema.optional(),
  }),
  delete: boolean().optional(),
}).noUnknown(true);
