import express from 'express';

import { createOrderCheckoutSessionController } from './payments/payments.controller';
import {
  createProductController,
  getCategoriesController,
  getProductController,
  getProductsController,
  searchProductsController,
  updateProductController,
} from './products/products.controller';
import {
  getLoggedUserController,
  getLoggedUserOrdersController,
  getOrderController,
} from './users/controllers/logged.user.controller';

export const router = express.Router();
export const adminRouter = express.Router();

router.post('/auth/me', getLoggedUserController);

router.post('/orders/getMany', getLoggedUserOrdersController);
router.post('/orders/get', getOrderController);

router.post('/products/categories', getCategoriesController);
router.post('/products/getMany', getProductsController);
router.post('/products/get', getProductController);
router.post('/products/search', searchProductsController);
router.post('/products/create', createProductController);
router.post('/products/update', updateProductController);

// Stripe payment routes
router.post(
  '/payments/createOrderSession',
  createOrderCheckoutSessionController
);
