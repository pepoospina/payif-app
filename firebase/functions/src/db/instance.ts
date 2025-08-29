import * as admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";

import { CollectionNames } from "../@shared/utils/collectionNames";
import { logger } from "../instances/logger";
import {
  HandleWithTxManager,
  ManagerConfig,
  ManagerModes,
  TransactionManager,
} from "./transaction.manager";

const DEBUG = false;

export type Query = FirebaseFirestore.Query<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

export class DBInstance {
  public firestore: Firestore;

  public collections: {
    users: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    payments: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  };

  constructor(firestore: Firestore) {
    if (DEBUG) logger.debug("Creating DBInstance");
    this.firestore = firestore;

    this.collections = {
      users: this.firestore.collection(CollectionNames.Users),
      payments: this.firestore.collection(CollectionNames.Payments),
    };
  }

  /** a wrapper of TransactionManager to instantiate and applyWrites automatically */
  async run<R, P>(
    func: HandleWithTxManager<R, P>,
    payload?: P,
    config: ManagerConfig = { mode: ManagerModes.TRANSACTION },
    debugId: string = "",
    DEBUG: boolean = false
  ): Promise<R> {
    switch (config.mode) {
      case ManagerModes.TRANSACTION:
        const result = await this.firestore.runTransaction(
          async (transaction) => {
            if (DEBUG) logger.debug(`Transaction started ${debugId}`);
            try {
              const manager = new TransactionManager(transaction);

              const result = await func(manager, payload);
              if (DEBUG)
                logger.debug(
                  `Transaction function ran ${debugId} (writes not applied)`,
                  {
                    result,
                  }
                );

              await manager.applyWrites();

              if (DEBUG) logger.debug(`Transaction writes applied ${debugId}`);

              return result;
            } catch (error: any) {
              logger.error(`Transaction failed ${debugId}`, error);
              throw new Error(error);
            }
          }
        );
        if (DEBUG)
          logger.debug(`Transaction fully executed ${debugId}`, { result });
        return result;

      case ManagerModes.BATCH: {
        try {
          const batch = this.firestore.batch();
          const manager = new TransactionManager(undefined, batch);
          const result = await func(manager, payload);
          await manager.applyWrites();
          return result;
        } catch (error: any) {
          logger.error("Transaction failed", error);
          throw new Error(error);
        }
      }
    }
  }

  /** WARNING!!! clear all collections */
  async clear() {
    const collections = await this.firestore.listCollections();
    await Promise.all(
      collections.map(async (collection) => {
        return this.firestore.recursiveDelete(collection);
      })
    );
  }

  async deleteCollection(collectionPath: string, batchSize = 500) {
    const collectionRef = this.firestore.collection(collectionPath);
    const query = collectionRef.orderBy("__name__").limit(batchSize);

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject);
    });
  }

  private async deleteQueryBatch(
    query: admin.firestore.Query,
    resolve: (value: void | PromiseLike<void>) => void
  ) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    // Delete documents in a batch
    const batch = this.firestore.batch();

    snapshot.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      this.deleteQueryBatch(query, resolve);
    });
  }
}
