import {
  AppUser,
  AppUserCreate,
  AppUserUpdate,
  DefinedIfTrue,
  UserSettings,
} from '../@shared/types/types.user';
import { DBInstance } from '../db/instance';
import { removeUndefined } from '../db/repo.base';
import { TransactionManager } from '../db/transaction.manager';
import { logger } from '../instances/logger';

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

  public async getByClerkId<T extends boolean>(
    clerkId: string,
    manager: TransactionManager,
    shouldThrow?: T
  ) {
    const clerkId_property: keyof AppUser = 'clerkId';
    const query = this.db.collections.users.where(
      clerkId_property,
      '==',
      clerkId
    );
    const snap = await manager.query(query);

    const _shouldThrow = shouldThrow !== undefined ? shouldThrow : false;

    if (snap.empty) {
      if (_shouldThrow)
        throw new Error(`User with clerkId: ${clerkId} not found`);
      else return undefined as DefinedIfTrue<T, string>;
    }

    if (snap.size > 1) {
      throw new Error(
        `Data corrupted. Unexpected multiple users with the same platform clerkId ${clerkId}`
      );
    }

    /** should not return the data as it does not include the tx manager cache */
    return snap.docs[0].id as DefinedIfTrue<T, string>;
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
    const ref = this.db.collections.users.doc(user.clerkId);
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

  public async updateSettings(
    userId: string,
    updateSettings: Partial<UserSettings>,
    manager: TransactionManager
  ) {
    const ref = await this.getUserRef(userId, manager, true);
    const existing = await this.getUser(userId, manager, true);

    const newSettings: UserSettings = {
      ...existing.settings,
      ...updateSettings,
    };

    manager.update(ref, {
      settings: newSettings,
    });
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

  public async getByEmail<T extends boolean, R = string>(
    email: string,
    manager: TransactionManager,
    _shouldThrow?: boolean
  ) {
    const emailKey: keyof AppUser = 'email';

    const query = this.db.collections.users.where(`${emailKey}`, '==', email);
    const users = await manager.query(query);

    const shouldThrow = _shouldThrow !== undefined ? _shouldThrow : false;

    if (users.empty) {
      if (shouldThrow) throw new Error(`User with email:${email} not found`);
      else return undefined as DefinedIfTrue<T, R>;
    }

    const doc = users.docs[0];

    return {
      id: doc.id,
      ...doc.data(),
    } as unknown as DefinedIfTrue<T, R>;
  }
}
