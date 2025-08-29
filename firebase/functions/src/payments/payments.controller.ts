import { RequestHandler } from "express";

import { CreateProduct, ProductOwner } from "../@shared/types/types.payments ";
import { getAuthenticatedUser, getServices } from "../controllers.utils";
import { logger } from "../instances/logger";
import {
  createProductSchema,
  getElementSchema,
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
    )) as GetPaymentsPayload;

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

    const products = await services.products.getProducts(payload.query);

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

export const getProductController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);
    const payload = (await getElementSchema.validate(
      request.body
    )) as GetProductPayload;

    if (DEBUG) logger.debug(`${request.path}: getProduct`, { payload });

    const product = await services.db.run((manager) =>
      services.products.getProduct(payload.id, manager)
    );

    if (DEBUG)
      logger.debug(`${request.path}: getProduct success`, {
        product: product,
      });

    response.status(200).send({ success: true, data: product });
  } catch (error: any) {
    logger.error("error", error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const createProductController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = getAuthenticatedUser(request, true);
    const services = getServices(request);
    const payload = (await createProductSchema.validate(
      request.body
    )) as CreateProduct;
    if (DEBUG) logger.debug(`${request.path}: createProduct`, { payload });

    const product = await services.db.run(async (manager) =>
      services.products.createProduct(
        payload,
        ProductOwner.USER,
        manager,
        userId
      )
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
