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

  public async createUser(clerkId: string, manager: TransactionManager) {
    const userId = await this.repo.createUser(
      {
        clerkId,
        signupDate: this.time.now(),
        profilesIds: [],
      },
      manager
    );

    return userId;
  }

  public async getLoggedUserRead(
    userId: string,
    manager: TransactionManager,
    refreshSubscription: boolean = false
  ) {
    const user = await this.repo.getUser(userId, manager, true);

    const userRead: AppUserRead = {
      userId,
      clerkId: user.clerkId,
      signupDate: user.signupDate,
    };

    return userRead;
  }

  async createCheckoutSession(
    userId: string,
    details: CreateCheckoutSession,
    manager: TransactionManager
  ) {
    const { cart, lang, address, contactDetails } = details;
    const user = await this.repo.getUser(userId, manager, true);

    const verifiedCart = await this.products.verifyCart(cart, manager);

    const session = await this.payments.createCheckoutSession(
      user.email,
      verifiedCart,
      lang
    );

    const order: OrderCreate = {
      userId,
      session,
      items: cart,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: this.time.now(),
      address,
      contactDetails,
    };

    await this.repo.update(
      userId,
      {
        address,
        phone: details.contactDetails.phone,
      },
      manager
    );

    this.orders.create(order, manager);

    return session;
  }

  async refreshLatestOrderStatus(userId: string, manager: TransactionManager) {
    const order = await this.orders.getLatestOrder(userId, manager);
    if (!order) return;

    await this.refreshOrderStatus(order.session.sessionId, manager);
  }

  async refreshOrderStatus(sessionId: string, manager: TransactionManager) {
    const stripe = await this.payments.getSessionFromId(sessionId);
    const order = await this.orders.getOrderBySessionId(sessionId, manager);

    if (
      order.paymentStatus === PaymentStatus.PENDING &&
      stripe.payment_status === "paid"
    ) {
      await this.orders.updateOrder(
        order.id,
        { paymentStatus: PaymentStatus.COMPLETED },
        manager
      );
    }
  }
}
