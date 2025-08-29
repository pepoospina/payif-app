import express from "express";

import { getLoggedUserController } from "./users/controllers/logged.user.controller";

import {
  createPaymentController,
  getPaymentController,
  getPaymentsController,
} from "./payments/payments.controller";

export const router = express.Router();
export const adminRouter = express.Router();

router.post("/auth/me", getLoggedUserController);

router.post("/payments/getMany", getPaymentsController);
router.post("/payments/get", getPaymentController);
router.post("/payments/create", createPaymentController);
