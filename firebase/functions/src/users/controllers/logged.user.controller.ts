import { RequestHandler } from "express";

import { getAuthenticatedUser, getServices } from "../../controllers.utils";
import { logger } from "../../instances/logger";

export const getLoggedUserController: RequestHandler = async (
  request,
  response
) => {
  try {
    const services = getServices(request);
    const userId = getAuthenticatedUser(request);

    const user = await services.db.run(async (manager) => {
      if (!userId) {
        return undefined;
      }

      return services.users.getLoggedUserRead(userId, manager);
    });

    response.status(200).send({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error("error", error);
    response.status(500).send({ success: false, error: error.message });
  }
};
