import { RequestHandler } from "express";

import { GetIndexedPayload } from "@shared/types/types.feed";
import { CreatePayment, GetPaymentPayload } from "@shared/types/types.payments";
import { getAuthenticatedUser, getServices } from "../controllers.utils";
import { logger } from "../instances/logger";
import {
  createPaymentSchema,
  getPaymentSchema,
  getProductsSchema,
} from "./payment.schema";

const DEBUG = false;

export const getPaymentsController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);
    const userId = getAuthenticatedUser(request);
    const payload = (await getProductsSchema.validate(
      request.body
    )) as GetIndexedPayload;

    if (DEBUG)
      logger.debug(`${request.path}: getCategoryProducts`, { payload });

    /** protect my recipes */
    if (payload.query.ownerId) {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      if (payload.query.ownerId !== userId) {
        throw new Error("Unauthorized");
      }
    }

    const products = await services.db.run(async (manager) =>
      services.payments.getMany(payload.query, manager)
    );

    if (DEBUG)
      logger.debug(`${request.path}: getCategoryProducts success`, {
        products: products,
      });

    response.status(200).send({ success: true, data: { elements: products } });
  } catch (error: any) {
    logger.error("error", error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const getPaymentController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);
    const payload = (await getPaymentSchema.validate(
      request.body
    )) as GetPaymentPayload;

    if (DEBUG) logger.debug(`${request.path}: getProduct`, { payload });

    const product = await services.db.run((manager) =>
      services.payments.get(payload.id, manager)
    );

    if (DEBUG)
      logger.debug(`${request.path}: getPayment success`, {
        product: product,
      });

    response.status(200).send({ success: true, data: product });
  } catch (error: any) {
    logger.error("error", error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const createPaymentController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = getAuthenticatedUser(request, true);
    const services = getServices(request);
    const payload = (await createPaymentSchema.validate(
      request.body
    )) as CreatePayment;
    if (DEBUG) logger.debug(`${request.path}: createProduct`, { payload });

    const product = await services.db.run(async (manager) =>
      services.payments.create(payload, manager, userId)
    );

    if (DEBUG)
      logger.debug(`${request.path}: createProduct success`, {
        product: product,
      });

    response.status(200).send({ success: true, data: product });
  } catch (error: any) {
    logger.error("error", error);
    response.status(500).send({ success: false, error: error.message });
  }
};
