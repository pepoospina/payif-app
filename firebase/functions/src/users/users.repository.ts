import {
  AppUser,
  AppUserCreate,
  AppUserUpdate,
  DefinedIfTrue,
} from "../@shared/types/types.user";
import { DBInstance } from "../db/instance";
import { removeUndefined } from "../db/repo.base";
import { TransactionManager } from "../db/transaction.manager";
import { logger } from "../instances/logger";

const DEBUG = false;

export class UsersRepository {
  constructor(protected db: DBInstance) {}

  protected async getUserRef(
    userId: string,
    manager: TransactionManager,
    onlyIfExists: boolean = false
  ) {
    const ref = this.db.collections.users.doc(userId);
    if (onlyIfExists) {
      const doc = await this.getUserDoc(userId, manager);

      if (!doc.exists) {
        throw new Error(`User ${userId} not found`);
      }
    }

    return ref;
  }

  protected async getUserDoc(userId: string, manager: TransactionManager) {
    const ref = await this.getUserRef(userId, manager);
    return manager.get(ref);
  }

  public async userExists(userId: string, manager: TransactionManager) {
    const doc = await this.getUserDoc(userId, manager);
    return doc.exists;
  }

  public async getUser<T extends boolean>(
    userId: string,
    manager: TransactionManager,
    shouldThrow?: T
  ): Promise<DefinedIfTrue<T, AppUser>> {
    let doc = await this.getUserDoc(userId, manager);

    if (!doc.exists) {
      const ref = this.db.collections.users.doc(userId);
      doc = await manager.get(ref);
    }

    const _shouldThrow = shouldThrow !== undefined ? shouldThrow : false;

    const data = doc.data();
    if (!doc.exists || !data || Object.keys(data).length === 0) {
      if (_shouldThrow) throw new Error(`User ${userId} not found`);
      else return undefined as DefinedIfTrue<T, AppUser>;
    }

    return {
      userId,
      ...doc.data(),
    } as unknown as DefinedIfTrue<T, AppUser>;
  }

  public async createUser(user: AppUserCreate, manager: TransactionManager) {
    const ref = this.db.collections.users.doc(user.userId);
    manager.create(ref, removeUndefined(user));
    return ref.id;
  }

  public async deleteUser(userId: string, manager: TransactionManager) {
    const ref = await this.getUserRef(userId, manager);
    manager.delete(ref);
  }

  public async getAll() {
    const snapshot = await this.db.collections.users.get();
    return snapshot.docs.map((doc) => doc.id);
  }

  public async getAllIds() {
    const snapshot = await this.db.collections.users.get();
    const usersIds: string[] = [];
    snapshot.forEach((doc) => {
      usersIds.push(doc.id);
    });

    return usersIds;
  }

  public async update(
    userId: string,
    update: AppUserUpdate,
    manager: TransactionManager
  ) {
    if (DEBUG) logger.debug(`update user ${userId}`, { update });

    const ref = await this.getUserRef(userId, manager, true);
    manager.update(ref, update);
  }
}
