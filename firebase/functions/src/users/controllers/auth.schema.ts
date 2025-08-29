import { boolean, object, string } from 'yup';

export const getLoggedUserSchema = object({
  subscriptions: boolean().optional(),
  connect: boolean().optional(),
}).noUnknown(true);

export const getOrderSchema = object({
  orderId: string().required(),
}).noUnknown(true);

export const oauthGetSignupContextSchema = object({
  callback_url: string().required(),
  type: string().oneOf(['read', 'write']).required(),
  stateValue: object({
    clusterId: string().required(),
    username: string().optional(),
    userId: string().optional(),
  }).noUnknown(true),
}).noUnknown(true);

export const twitterSignupDataSchema = object({
  code: string().required(),
  state: string().required(),
  iss: string().optional(),
  codeVerifier: string().optional(),
  callback_url: string().optional(),
}).noUnknown(true);
