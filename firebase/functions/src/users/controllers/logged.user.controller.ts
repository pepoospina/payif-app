import { RequestHandler } from 'express';

import { GetLoggedUserPayload } from '../../@shared/types/types.user';
import { getAuthenticatedUser, getServices } from '../../controllers.utils';
import { logger } from '../../instances/logger';
import { getLoggedUserSchema, getOrderSchema } from './auth.schema';

export const getLoggedUserOrdersController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = getAuthenticatedUser(request, true);
    const services = getServices(request);
    await services.db.run(async (manager) => {
      await services.users.refreshLatestOrderStatus(userId, manager);
    });

    const orders = await services.db.run(async (manager) =>
      services.users.orders.getUserOrders(userId, manager)
    );

    response.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const getOrderController: RequestHandler = async (request, response) => {
  try {
    const services = getServices(request);
    const userId = getAuthenticatedUser(request, true);

    const payload = (await getOrderSchema.validate(request.body)) as {
      orderId: string;
    };

    const order = await services.db.run(async (manager) => {
      const order = await services.users.orders.get(
        payload.orderId,
        manager,
        true
      );
      if (order.userId !== userId) {
        throw new Error('Unauthorized');
      }
      return order;
    });

    response.status(200).send({
      success: true,
      data: order,
    });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const getLoggedUserController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);

    const payload = (await getLoggedUserSchema.validate(
      request.body
    )) as GetLoggedUserPayload;

    const user = await services.db.run(async (manager) => {
      const userId = await (async () => {
        /**
         * if the clerkuser exist, return that userId, otherwise
         * here es where we create a new user in the DB
         */
        const clerkId = getAuthenticatedUser(request);

        if (payload.connect && clerkId) {
          const exists = await services.users.repo.userExists(clerkId, manager);
          if (exists) {
            return clerkId;
          }

          return services.users.createUser(clerkId, manager);
        }

        if (clerkId) return clerkId;

        throw new Error('Unexpected user not logged in');
      })();

      return services.users.getLoggedUserRead(
        userId,
        manager,
        payload.subscriptions
      );
    });

    response.status(200).send({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
