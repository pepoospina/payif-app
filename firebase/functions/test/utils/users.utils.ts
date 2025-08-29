import { AppUser } from '../../src/@shared/types/types.user';
import { TransactionManager } from '../../src/db/transaction.manager';
import { Services } from '../../src/instances/services';
import { TestUserData } from '../__tests__/setup';

export const createUsers = async (
  services: Services,
  testUsers: TestUserData[],
  manager: TransactionManager
): Promise<AppUser[]> => {
  /** if no specific users specified, create them all */
  const users = await Promise.all(
    testUsers.map(async (userData) => {
      /** create the user */
      const userId = await services.users.repo.createUser(
        userData.user,
        manager
      );

      const user = await services.users.repo.getUser(userId, manager, true);
      return { ...user, userId };
    })
  );

  /** create profiles too */
  return users;
};
