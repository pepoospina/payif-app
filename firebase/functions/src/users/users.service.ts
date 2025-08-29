import { AppUserRead } from "../@shared/types/types.user";
import { DBInstance } from "../db/instance";
import { TransactionManager } from "../db/transaction.manager";
import { PaymentsService } from "../payments/payments.service";
import { TimeService } from "../time/time.service";
import { UsersRepository } from "./users.repository";

/**
 * A user profile is made up of a dictionary of PLATFORM => Arrray<AuthenticationDetails>
 * One user can have multiple profiles on each platform.
 *
 * Authentication details may be OAuth access tokens, or validated details about the user
 * identity like its public key/address.
 */
export class UsersService {
  constructor(
    public db: DBInstance,
    public repo: UsersRepository,
    protected payments: PaymentsService,
    protected time: TimeService
  ) {}

  public async createUser(userId: string, manager: TransactionManager) {
    const _userId = await this.repo.createUser({ userId }, manager);
    return _userId;
  }

  public async getLoggedUserRead(
    userId: string,
    manager: TransactionManager,
    refreshSubscription: boolean = false
  ) {
    const user = await this.repo.getUser(userId, manager, true);

    const userRead: AppUserRead = {
      userId,
      signupDate: user.signupDate,
    };

    return userRead;
  }
}
