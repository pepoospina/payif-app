import { PLATFORM } from '../../src/@shared/types/types.platforms';
import {
  AppUser,
  TestUserCredentials,
} from '../../src/@shared/types/types.user';
import { TransactionManager } from '../../src/db/transaction.manager';
import { TestServices } from '../__tests__/test.services';

export const authenticateTestUsers = async (
  credentials: TestUserCredentials[],
  services: TestServices,
  includePlatforms: PLATFORM[],
  manager: TransactionManager
) => {
  return Promise.all(
    credentials.map((credential) =>
      authenticateTestUser(credential, services, includePlatforms, manager)
    )
  );
};

export const authenticateTestUser = async (
  credentials: TestUserCredentials,
  services: TestServices,
  includePlatforms: PLATFORM[],
  manager: TransactionManager
): Promise<AppUser> => {
  let user: AppUser = {
    userId: credentials.userId,
    clerkId: credentials.clerkId,
    email: '',
    onboarded: false,
    clerkUser: {
      id: '',
      emailAddresses: [],
      fullName: '',
      imageUrl: '',
    },
    settings: {},
    signupDate: Date.now(),
    profilesIds: [],
  };

  if (!user) {
    throw new Error('No platforms were authenticated');
  }

  return user;
};
